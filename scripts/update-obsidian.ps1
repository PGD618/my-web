<#
.SYNOPSIS
  Pull latest Obsidian content from git submodule
.DESCRIPTION
  Updates the content/ submodule from PGD618/Obsidian repo.
  Can be run manually or via Windows Task Scheduler for periodic sync.
#>

$ProjectRoot = "D:\桌面文件夹\编程\前端开发\Next.js\my-web"
$LogFile = Join-Path $ProjectRoot "scripts\sync-obsidian.log"

Write-Host "[Obsidian Sync] Pulling latest content..." -ForegroundColor Cyan

Push-Location $ProjectRoot
try {
  $result = git submodule update --remote --merge content 2>&1
  $output = $result -join "`n"
  Write-Host $output
  
  $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
  "$timestamp`n$output`n---" | Out-File -FilePath $LogFile -Append -Encoding UTF8
  
  if ($LASTEXITCODE -eq 0) {
    Write-Host "[Obsidian Sync] Done!" -ForegroundColor Green
  } else {
    Write-Host "[Obsidian Sync] Completed (exit: $LASTEXITCODE)" -ForegroundColor Yellow
  }
} finally {
  Pop-Location
}
