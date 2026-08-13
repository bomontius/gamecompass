param([switch]$CatchUp)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$now = Get-Date

if (-not $CatchUp -and ($now.DayOfWeek -ne [DayOfWeek]::Friday -or $now.Hour -lt 13 -or $now.Hour -ge 20)) {
    exit 0
}

$markerPath = Join-Path $root 'data\weekly-marker.json'
$today = $now.ToString('yyyy-MM-dd')
if (Test-Path -LiteralPath $markerPath) {
    try {
        $marker = Get-Content -Raw -LiteralPath $markerPath | ConvertFrom-Json
        if ($marker.date -eq $today) { exit 0 }
        if ($CatchUp -and $marker.updatedAt) {
            $lastUpdate = [datetime]::Parse($marker.updatedAt)
            if (($now - $lastUpdate).TotalDays -lt 7) { exit 0 }
        }
    } catch { }
}

$python = (Get-Command python.exe -ErrorAction Stop).Source
$server = Join-Path $root 'server.py'
& $python $server '--root' $root '--update' '--weekly'
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

@{ date = $today; updatedAt = (Get-Date).ToString('o') } |
    ConvertTo-Json | Set-Content -Encoding UTF8 -LiteralPath $markerPath
