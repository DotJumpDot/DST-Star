/**
 * DST Star identity regression: splash words, starlight theme, plain stats.
 *
 * Locks the fork's Phase-3 contract:
 *  1. branding: the deepseek-brand splash words read DST / STAR with the
 *     starlight tagline (zh + en);
 *  2. the `star` theme is a first-class built-in: its palette carries the
 *     starlight accent/ink, `auto` resolves dark to it (identity, not a
 *     lookalike), and it plays the dark role;
 *  3. a rendered transcript under the star theme keeps its text intact and
 *     actually carries the starlight accent + ink SGR sequences (the theme
 *     is live in the render, not just resolvable);
 *  4. stats stay plain: no sparkline/gauge glyphs anywhere on the screen
 *     (numbers render as digits, single color — the family rail).
 *
 * Run: node --import tsx/esm scripts/verify-star-transcript.tsx
 */
process.env.FORCE_COLOR = '3'
process.env.DSH_TUI_THEME = 'star'
process.env.DSH_TUI_LANG = 'en'

const [{ PassThrough, Writable }, React, { Terminal: XTerm }, { render, AlternateScreen, ThemeProvider }, { Chat }, { QuestionStore }, { LOCAL_COMMANDS, completeCommands }, { settled, sleep }, { getTheme, THEME_NAMES, isLightThemeActive }, { BRAND_SPLASH_WORDS }, i18nModule] = await Promise.all([
  import('node:stream'),
  import('react'),
  import('@xterm/headless'),
  import('../src/ui.js'),
  import('../src/screens/Chat.js'),
  import('../src/dsh-adapter/questions.js'),
  import('../src/commands.js'),
  import('./lib/term-test.mjs'),
  import('../src/theme.js'),
  import('../src/branding.js'),
  import('../src/i18n.js'),
])

const COLS = 100, ROWS = 40
let failed = 0
function check(name: string, ok: boolean, extra = ''): void {
  console.log(`${ok ? 'PASS' : 'FAIL'}: ${name}${extra ? `  (${extra})` : ''}`)
  if (!ok) failed += 1
}

const term = new XTerm({ cols: COLS, rows: ROWS, scrollback: 0, allowProposedApi: true })
let raw = ''
class FakeStdout extends Writable {
  columns = COLS; rows = ROWS; isTTY = true
  _write(chunk: unknown, _e: BufferEncoding, cb: () => void) { raw += String(chunk); term.write(String(chunk), cb) }
}
class FakeStderr extends Writable { isTTY = true; _write(_c: unknown, _e: BufferEncoding, cb: () => void) { cb() } }
class FakeStdin extends PassThrough {
  isTTY = true
  setRawMode() { return this }
  ref() { return this }
  unref() { return this }
}
const stdin = new FakeStdin(), stdout = new FakeStdout(), stderr = new FakeStderr()

function screenLines(): string[] {
  const buf = term.buffer.active
  return Array.from({ length: ROWS }, (_, y) => buf.getLine(buf.baseY + y)?.translateToString(true) ?? '')
}
function screen(): string { return screenLines().join('\n') }

// 1. Branding: splash words + tagline carry the fork identity.
{
  const words = BRAND_SPLASH_WORDS.deepseek
  check('brand: splash top word is DST', words.top === 'DST', words.top)
  check('brand: splash bottom word is STAR', words.bottom === 'STAR', words.bottom)
  check('brand: splash plain name is DST Star', words.plain === 'DST Star', words.plain)
  const taglineEn = i18nModule.t('logo-tagline') as string
  check('brand: english tagline names the starlight terminal', taglineEn.includes('starlight'), taglineEn)
}

// 2. Theme identity: the star palette is registered, distinct, and the
//    auto-dark slot resolves to it (headless autoBase defaults dark).
{
  check('theme: star is a built-in name', (THEME_NAMES as readonly string[]).includes('star'))
  const star = getTheme('star')
  check('theme: star accent is the starlight blue', star.accent === 'rgb(143,193,242)', star.accent)
  check('theme: star ink is cool ivory', star.text === 'rgb(236,242,250)', star.text)
  check('theme: star tool cards are deep navy', star.toolCardBackground === 'rgb(26,36,64)', star.toolCardBackground)
  check('theme: star is its own palette, not dark', star !== getTheme('dark'))
  check('theme: auto resolves dark to the star palette', getTheme('auto') === star)
  check('theme: star plays the dark role', isLightThemeActive('star') === false)
}

// 3. A rendered transcript under the star theme: text intact + the theme's
//    own SGR sequences in the live output. Markdown bakes palette colors
//    into ANSI (inline code = permission, quote bar = subtle), so a markdown
//    answer proves the star palette is live in the render, not just
//    resolvable from getTheme().
const rows: any[] = [
  Object.freeze({ id: 1, kind: 'user', text: 'STAR-QUESTION-MARKER' }),
  Object.freeze({ id: 2, kind: 'assistant', text: 'STAR-ANSWER-MARKER\n> star-quote-line\n`star-code-span`', streaming: false }),
]
const listeners = new Set<() => void>()
const channel: any = {
  whaleIdle: false,
  version: 0, rows, status: 'idle', sessionTitle: 'probe', agentId: 'probe',
  model: 'deepseek-v4-flash', provider: 'deepseek', reasoningEffort: 'max', effortLevels: [],
  tokens: { input: 12345, output: 678 }, cwd: '/tmp/demo', displayCwd: '/tmp/demo', gitBranch: 'main',
  working: false, spinnerMode: 'requesting', responseChars: 0, activeToolCount: 0, turnStart: 0,
  pending: [], commandList: LOCAL_COMMANDS, notifications: [], mode: { plan: false, sandbox: undefined },
  activityFrames: 'moon8', agentPreset: undefined, subagents: [], lastUserText: 'STAR-QUESTION-MARKER',
  scrollGutter: 'timeline',
  subscribe(cb: () => void) { listeners.add(cb); return () => listeners.delete(cb) },
  emit() { channel.version++; for (const cb of listeners) cb() },
  submit: () => {}, cancel: () => {}, clear: () => {}, notify: () => {},
  listModels: () => Promise.resolve([]), listSessions: () => Promise.resolve([]),
  deleteSession: () => Promise.resolve(true), renameSessionTo: () => Promise.resolve(true),
  setResumeTarget: () => {}, loadOlder: () => {}, mcpStatus: () => [], pushLocal: () => {},
  commandCompletions: (input: string) => completeCommands(input),
}

const inst = await render(
  // The explicit `theme` prop locks ThemeProvider to the star palette for
  // the whole tree (the DSH_TUI_THEME env alone does not seed the provider
  // in a bare harness — `active` stays null and falls back to dark).
  <ThemeProvider theme="star">
    <AlternateScreen><Chat channel={channel} questionStore={new QuestionStore()} fullscreen /></AlternateScreen>
  </ThemeProvider>,
  { stdout: stdout as any, stdin: stdin as any, stderr: stderr as any, exitOnCtrlC: false, patchConsole: false },
)

check('render: the question text renders', await settled(() => screen().includes('STAR-QUESTION-MARKER')))
check('render: the answer text renders', screen().includes('STAR-ANSWER-MARKER'))
check('render: the answer keeps its quote line', screen().includes('star-quote-line'))
{
  // SGR form of the star palette's baked markdown colors: 'rgb(r,g,b)' → 'r;g;b'.
  const sgrOf = (css: string): string => css.replace(/^rgb\((\d+),(\d+),(\d+)\)$/, '$1;$2;$3')
  const star = getTheme('star')
  check('render: star permission color reaches the terminal (inline code)', raw.includes(sgrOf(star.permission)), sgrOf(star.permission))
  check('render: star subtle color reaches the terminal (quote bar)', raw.includes(sgrOf(star.subtle)), sgrOf(star.subtle))
  check('render: star ink differs from stock dark ink', getTheme('dark').text !== star.text)
}

// 4. Stats stay plain: wherever numbers render, they are digits with no
//    gauge/sparkline glyphs on the same line (the family rail — plain
//    single-color numbers; the mascot's block-art rows carry no digits and
//    are legitimate).
{
  const digitLines = screenLines().filter(line => /\d/.test(line))
  check('stats: some stat/version numbers render', digitLines.length > 0, 'lines=' + String(digitLines.length))
  const gauged = digitLines.filter(line => /[▁▂▃▄▅▆▇█▓▒░]/.test(line))
  check('stats: no gauge or sparkline glyphs ride a number line', gauged.length === 0, gauged[0]?.trim().slice(0, 40) ?? '')
}

inst.unmount()
await sleep(50)
if (failed > 0) {
  console.error('FAILED: ' + failed + ' check(s).')
  process.exit(1)
}
console.log('OK: star transcript checks passed.')
process.exit(0)
