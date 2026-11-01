// Merge the repo's profile patch over the installed one WITHOUT losing rows
// the running TUI wrote (the /provider editor and the plugin manager persist
// user-added rows — a custom cloud provider, a route — into the profile's
// cordis.patch.yml). The repo file stays the source of truth for the rows it
// manages; top-level rows that exist ONLY in the installed patch are carried
// over verbatim. The installed file is backed up before the write.
//
// This is a top-level block merge, not a YAML parse: a row starts at a
// line-begin `- id:` and owns everything up to the next one. Row identity is
// the normalized id (quotes stripped). Repo rows always win on collision —
// edit those in profile/cordis.patch.yml and re-run the installer.
//
// Usage: node scripts/merge-patch.mjs <repo-patch> <installed-patch>
import { readFileSync, writeFileSync, copyFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs'
import { join } from 'node:path'

const [repoPath, installedPath] = process.argv.slice(2)
if (repoPath === undefined || installedPath === undefined) {
  console.error('usage: node scripts/merge-patch.mjs <repo-patch> <installed-patch>')
  process.exit(1)
}
if (!existsSync(repoPath)) { console.error(`missing repo patch: ${repoPath}`); process.exit(1) }
if (!existsSync(installedPath)) {
  // First install: nothing to merge, plain copy.
  copyFileSync(repoPath, installedPath)
  console.log('[merge-patch] no installed patch yet - copied repo patch fresh')
  process.exit(0)
}

const read = (p) => readFileSync(p, 'utf8').replaceAll('\r\n', '\n')
const eol = (text) => (text.includes('\r\n') ? '\r\n' : '\n')

/** Split a patch document into { header, blocks: [{ id, text }] }. */
function splitBlocks(text) {
  const lines = text.split('\n')
  const header = []
  const blocks = []
  let current = null
  for (const line of lines) {
    const match = /^- id:\s*(.+?)\s*$/.exec(line)
    if (match !== null) {
      current = { id: match[1].replace(/^["']|["']$/g, ''), lines: [line] }
      blocks.push(current)
    } else if (current === null) {
      header.push(line)
    } else {
      current.lines.push(line)
    }
  }
  return { header: header.join('\n'), blocks }
}

const repo = splitBlocks(read(repoPath))
const installed = splitBlocks(read(installedPath))
const repoIds = new Set(repo.blocks.map(block => block.id))

const carried = installed.blocks.filter(block => !repoIds.has(block.id))
if (carried.length === 0) {
  copyFileSync(repoPath, installedPath)
  console.log('[merge-patch] no user-only rows in the installed patch - copied repo patch as-is')
  process.exit(0)
}

// Timestamped backup of the installed patch before the write (keep the last
// 5; family lesson: never overwrite the only copy of user config).
const stamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '-').slice(0, 15)
const dir = installedPath.slice(0, Math.max(installedPath.lastIndexOf('/'), installedPath.lastIndexOf('\\')))
const backups = readdirSync(dir).filter(name => name.startsWith('cordis.patch.yml.bak-')).sort()
copyFileSync(installedPath, join(dir, `cordis.patch.yml.bak-${stamp}`))
for (const old of backups.slice(0, Math.max(0, backups.length - 4))) unlinkSync(join(dir, old))

const repoText = read(repoPath)
const sep = eol(repoText)
const carriedText = carried
  .map(block => block.lines.join('\n').replace(/\n*$/, ''))
  .join(sep + sep)
const out = repoText.replace(/\n*$/, sep)
  + '# ── rows preserved from the installed patch (written by the TUI: /provider ──' + sep
  + '# ── or the plugin manager; the installer carries them over on every run) ────' + sep
  + carriedText + sep
writeFileSync(installedPath, out)
console.log(`[merge-patch] preserved ${carried.length} user row(s): ${carried.map(block => block.id).join(', ')}`)
console.log(`[merge-patch] backup: cordis.patch.yml.bak-${stamp}`)
