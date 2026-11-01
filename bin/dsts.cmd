@echo off
rem dsts — DST Star launcher.
rem Boots dsh with the dst-star profile; the profile carries OUR minimal
rem fork of the LATEST upstream dsh-tui (see VENDORED.md) — the clean
rem daily driver. Cloud providers come from the built-in catalog; the
rem user supplies their own credentials through the normal dsh
rem onboarding flow.
rem Equivalent to: dsh --profile dst-star <args>
rem   --resume: restore the session id written to %USERPROFILE%\.dst-star\resume.txt
rem DST-Star keeps its own state (%USERPROFILE%\.dst-star) so it never
rem shares settings, history or session logs with a sibling fork
rem (DST-Comet .dsh-tui-comet, DST-Moon .dst-moon).
rem Prereq: dsh CLI on PATH (npm i -g @deepseek-ai/dsh), profile
rem         initialized with the DST-Star fork (scripts\install-fork.bat).
setlocal
if not defined NODE_ENV set "NODE_ENV=production"
if not defined DSH_TUI_SESSION_ROOT set "DSH_TUI_SESSION_ROOT=%USERPROFILE%\.dst-star\sessions"
rem Fork-isolation pin (same convention as the comet/moon forks'
rem launchers): the TUI also reads DSH_TUI_STATE_DIR, so even if a rebase
rem restores the upstream ~/.dsh-tui default the state dir stays
rem Star-owned.
if not defined DSH_TUI_STATE_DIR set "DSH_TUI_STATE_DIR=%USERPROFILE%\.dst-star"
set "WORKSPACE=%DSH_TUI_WORKSPACE%"
if "%WORKSPACE%"=="" set "WORKSPACE=%CD%"
cd /d "%WORKSPACE%"

where dsh >nul 2>nul
if errorlevel 1 (
  echo [dsts] dsh CLI not found. Install it first: npm install -g @deepseek-ai/dsh 1>&2
  exit /b 1
)

set "ARGS="
:parse
if "%~1"=="" goto :run
if /i "%~1"=="--resume" (
  if exist "%USERPROFILE%\.dst-star\resume.txt" (
    set /p DSH_TUI_RESUME_SESSION=<"%USERPROFILE%\.dst-star\resume.txt"
  )
) else (
  set "ARGS=%ARGS% "%~1""
)
shift
goto :parse

:run
@dsh --profile dst-star %ARGS%
endlocal
