$ErrorActionPreference = 'Stop'
Unregister-ScheduledTask -TaskName 'OyunPusulasiWeeklyUpdate' -Confirm:$false -ErrorAction SilentlyContinue
Write-Output 'Haftalik guncelleme devre disi birakildi.'
