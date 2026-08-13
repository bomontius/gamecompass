$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$executable = Join-Path $root 'Oyun Pusulasi.exe'

if (Test-Path -LiteralPath $executable) {
    Start-Process -FilePath $executable | Out-Null
    exit 0
}

$python = (Get-Command python.exe -ErrorAction Stop).Source
$serverPath = Join-Path $root 'server.py'
$port = 8765
while (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue) { $port++ }
Start-Process -FilePath $python -ArgumentList @($serverPath, '--root', $root, '--port', "$port") -WindowStyle Hidden | Out-Null
Start-Sleep -Milliseconds 700
Start-Process "http://127.0.0.1:$port/" | Out-Null
