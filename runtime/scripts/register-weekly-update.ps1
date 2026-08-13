param([string]$AppExecutable)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$taskName = 'OyunPusulasiWeeklyUpdate'
$scriptPath = Join-Path $root 'scripts\weekly-update.ps1'
if ($AppExecutable) {
    $action = New-ScheduledTaskAction -Execute $AppExecutable -Argument '--weekly-update'
} else {
    $action = New-ScheduledTaskAction -Execute 'powershell.exe' -Argument "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File `"$scriptPath`""
}
$triggers = 13..19 | ForEach-Object {
    New-ScheduledTaskTrigger -Weekly -DaysOfWeek Friday -At ([datetime]::Today.AddHours($_))
}
$settings = New-ScheduledTaskSettingsSet -StartWhenAvailable -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries
Register-ScheduledTask -TaskName $taskName -Action $action -Trigger $triggers -Settings $settings -Description 'Oyun Pusulasi: Steam kamu verileriyle eslesen oyunlari haftalik gunceller.' -Force | Out-Null
Write-Output "Haftalik guncelleme etkin: $taskName"
