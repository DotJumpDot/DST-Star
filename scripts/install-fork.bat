@echo off
rem DST-Star installer: builds the fork (if needed), packs it to
rem dist\dst-star.tgz, installs it into the dst-star dsh profile
rem (created if missing), pins the profile's bundle list to exactly
rem ["@deepseek-ai/dsh-base", "@deepseek-harness-tui/dsh-tui"] (no MCP,
rem no agent-teams, no engine tarballs — that's the whole point of Star),
rem and copies profile\cordis.patch.yml over the profile's patch layer.
rem The profile keeps a file: dependency on the tarball, so it must STAY
rem on disk — future dsh plugin / pnpm operations in the profile resolve it.
rem
rem After this, copy bin\dsts.cmd to %%APPDATA%%\npm\dsts.cmd if you launch
rem dsts from PATH (every bin/dsts.cmd change needs the re-copy).
rem
rem pnpm 11 + nodeLinker=hoisted is required for pack: pnpm 12 refuses
rem bundledDependencies under the default isolated linker, and npm cannot
rem install the workspace at all (workspace:* protocol).
setlocal enabledelayedexpansion
set "ROOT=%~dp0.."
set "FORK=%ROOT%\vendor\dsh-tui"
set "DIST=%ROOT%\dist"
set "PROFILE=dst-star"
set "PROFILEDIR=%USERPROFILE%\.dsh\profiles\dst-star"

where dsh >nul 2>nul || (echo [dsts-install] dsh CLI not on PATH & exit /b 1)

rem lib\settings.json is the "is it built" marker (there is no
rem lib\index.js). The fork is a pnpm workspace, so the build goes through
rem pnpm, never npm (npm chokes on workspace:*).
if not exist "%FORK%\lib\settings.json" (
  echo [dsts-install] lib/ missing - building fork with pnpm...
  pushd "%FORK%"
  call npx -y pnpm@11.21.0 install --config.nodeLinker=hoisted
  if errorlevel 1 (popd & echo [dsts-install] fork install failed & exit /b 1)
  call npx -y pnpm@11.21.0 run compile
  if errorlevel 1 (popd & echo [dsts-install] fork compile failed & exit /b 1)
  popd
)

if not exist "%DIST%\dst-star.tgz" (
  if not exist "%DIST%" mkdir "%DIST%"
  echo [dsts-install] packing fork -^> dist\dst-star.tgz ...
  pushd "%FORK%"
  if exist "*.tgz" del "*.tgz"
  call npx -y pnpm@11.21.0 pack --config.nodeLinker=hoisted
  if errorlevel 1 (popd & echo [dsts-install] pack failed & exit /b 1)
  set "TGZ="
  for /f "delims=" %%f in ('dir /b *.tgz 2^>nul') do set "TGZ=%%f"
  if "!TGZ!"=="" (popd & echo [dsts-install] no tarball produced & exit /b 1)
  move /y "!TGZ!" "%DIST%\dst-star.tgz" >nul
  popd
)

rem The a0630f4 TUI bundle rides two first-party plugins at 0.1.0-rc.6
rem (code-runtime-worker-thread, agent-presets) whose requirements read
rem ^0.1.0-rc.6 while the installed dsh host is 0.2.1-rc.2 — the same
rem pairing the Moon profile runs byte-for-byte. Grant exactly these two
rem exemptions before adding so a fresh run is unattended (recorded in
rem Docs/CHANGES.md; they are bundle internals, NOT added plugins).
call dsh plugin --profile %PROFILE% allow-version @deepseek-ai/dsh-code-runtime-worker-thread@0.1.0-rc.6 --dsh-version 0.2.1-rc.2 --accept-risk >nul 2>nul
call dsh plugin --profile %PROFILE% allow-version @deepseek-ai/dsh-agent-presets@0.1.0-rc.6 --dsh-version 0.2.1-rc.2 --accept-risk >nul 2>nul

echo [dsts-install] installing fork into profile %PROFILE% ...
call dsh plugin --profile %PROFILE% add "%DIST%\dst-star.tgz"
if errorlevel 1 (echo [dsts-install] fork install failed & exit /b 1)

echo [dsts-install] copying profile patch layer ...
if not exist "%PROFILEDIR%" mkdir "%PROFILEDIR%"
copy /y "%ROOT%\profile\cordis.patch.yml" "%PROFILEDIR%\cordis.patch.yml" >nul

rem Pin the bundle list to exactly the two Star bundles: dsh plugin add
rem maintains the dependency row; the bundles array is what boots, so an
rem accidental extra row (a plugin, an agent-team) would ride the profile
rem otherwise. Node is guaranteed present (dsh needs it).
echo [dsts-install] pinning bundle list to dsh-base + dsh-tui ...
pushd "%PROFILEDIR%"
node -e "const fs=require('node:fs');const p=JSON.parse(fs.readFileSync('package.json','utf8'));p.dsh=p.dsh||{};p.dsh.profile=p.dsh.profile||{};p.dsh.profile.bundles=['@deepseek-ai/dsh-base','@deepseek-harness-tui/dsh-tui'];fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n')"
if errorlevel 1 (popd & echo [dsts-install] bundle pin failed & exit /b 1)
popd

echo [dsts-install] done. Launch with: dsts
echo [dsts-install] (PATH users: copy bin\dsts.cmd to %%APPDATA%%\npm\dsts.cmd)
