$chars = @(
  [char]0x0102, # Ă
  [char]0x0139, # Ĺ
  [char]0x00E2, # â
  [char]0x00C2, # Â
  [char]0x00C4, # Ä
  [char]0x00C3, # Ã
  [char]0x0111  # đ
)

$pattern = ($chars | ForEach-Object { [regex]::Escape([string]$_) }) -join '|'
$replacementChar = [char]0xFFFD

function Count-Suspicious([string]$text) {
  return ([regex]::Matches($text, $pattern)).Count
}

$files = @()
$files += Get-ChildItem app,lib -Recurse -File -Include *.ts,*.tsx
$files += Get-Item App.tsx

$changedFiles = @()

foreach ($file in $files) {
  $lines = Get-Content -LiteralPath $file.FullName
  $changed = $false

  for ($i = 0; $i -lt $lines.Count; $i++) {
    $original = [string]$lines[$i]
    $origCount = Count-Suspicious $original

    if ($origCount -gt 0) {
      $converted = [System.Text.Encoding]::UTF8.GetString(
        [System.Text.Encoding]::GetEncoding(1250).GetBytes($original)
      )
      if ($converted -ne $original -and -not $converted.Contains($replacementChar)) {
        $lines[$i] = $converted
        $changed = $true
      }
    }
  }

  if ($changed) {
    Set-Content -LiteralPath $file.FullName -Value $lines -Encoding utf8
    $changedFiles += $file.FullName
  }
}

$changedFiles
