// DST-Star desktop shortcut — WScript.Shell automation via cscript.
//
// Creates ~/Desktop/DST-Star.lnk -> %APPDATA%\npm\dsts.cmd with the icon
// from a cache-proof path (~/.dsh/icons/dst-star-v2.ico — a fresh filename
// beats the Windows icon cache; family lesson #4). Run from Git Bash:
//   cscript //nologo scripts/make-shortcut.js
// A committed JScript file (not inline PowerShell) because inline scripts
// mangle backslashes through Git Bash (family lesson #5), and the first
// attempt at hand-rolled ctypes COM (make-shortcut.py) was too fragile —
// WScript.Shell's shortcut object is the OS's own tested automation.
(function () {
  var fso = new ActiveXObject('Scripting.FileSystemObject')
  var shell = new ActiveXObject('WScript.Shell')

  var home = shell.ExpandEnvironmentStrings('%USERPROFILE%')
  var repo = fso.GetParentFolderName(fso.GetParentFolderName(WScript.ScriptFullName))

  var srcIcon = repo + '\\assets\\dst-star.ico'
  var iconsDir = home + '\\.dsh\\icons'
  if (!fso.FolderExists(iconsDir)) fso.CreateFolder(iconsDir)
  var icon = iconsDir + '\\dst-star-v2.ico'
  fso.CopyFile(srcIcon, icon, true)
  WScript.Echo('icon: ' + icon + ' (' + fso.GetFile(icon).Size + ' bytes)')

  var target = shell.ExpandEnvironmentStrings('%APPDATA%') + '\\npm\\dsts.cmd'
  if (!fso.FileExists(target)) {
    WScript.Echo('ERROR: launcher shim missing: ' + target + ' (run scripts\\install-fork.bat first)')
    WScript.Quit(1)
  }

  var lnkPath = shell.SpecialFolders('Desktop') + '\\DST-Star.lnk'
  var lnk = shell.CreateShortcut(lnkPath)
  lnk.TargetPath = target
  lnk.WorkingDirectory = home
  lnk.WindowStyle = 1 // SW_SHOWNORMAL
  lnk.IconLocation = icon + ',0'
  lnk.Save()
  WScript.Echo('shortcut: ' + lnkPath + ' -> ' + target + ' [icon: ' + icon + ']')

  // Self-verify: reopen the saved file and read the stored values back.
  var back = shell.CreateShortcut(lnkPath)
  if (back.TargetPath.toLowerCase() !== target.toLowerCase()) {
    WScript.Echo('ERROR: readback mismatch: ' + back.TargetPath)
    WScript.Quit(1)
  }
  WScript.Echo('verified: target = ' + back.TargetPath + ', icon = ' + back.IconLocation)
})()
