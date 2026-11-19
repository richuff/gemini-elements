Set WshShell = CreateObject("WScript.Shell")
scriptDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
cmd = "node """ & scriptDir & "\sidecars\periodic-selector\main.mjs"""
WshShell.Run cmd, 0, False
