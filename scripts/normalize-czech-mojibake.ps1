$replacements = [ordered]@{
  'â€”' = '—'
  'â€¦' = '…'
  'â€ž' = '„'
  'â€ś' = '“'
  'â€ť' = '”'
  'â€™' = '’'
  'Ăˇ' = 'á'
  'Ă©' = 'é'
  'Ă­' = 'í'
  'Ăł' = 'ó'
  'Ăş' = 'ú'
  'Ă˝' = 'ý'
  'Ă�' = 'Á'
  'Ă‰' = 'É'
  'Ă�' = 'Í'
  'Ă“' = 'Ó'
  'Ăš' = 'Ú'
  'Ăť' = 'Ú'
  'Ăť' = 'ú'
  'ÄŤ' = 'č'
  'ÄŚ' = 'Č'
  'Ä›' = 'ě'
  'Äš' = 'Ě'
  'Ĺ™' = 'ř'
  'Ĺ�' = 'Ř'
  'Ĺˇ' = 'š'
  'Ĺ ' = 'Š'
  'Ĺľ' = 'ž'
  'Ĺ˝' = 'Ž'
  'ÄŹ' = 'ď'
  'ÄŽ' = 'Ď'
  'ĹĄ' = 'ť'
  'Ĺ¤' = 'Ť'
  'Ĺ�' = 'ň'
  'Ĺ‡' = 'Ň'
}
$files = Get-ChildItem -Recurse -File app,lib | Where-Object { $_.Extension -in '.ts','.tsx' }
foreach ($file in $files) {
  $content = Get-Content -Raw $file.FullName
  $updated = $content
  foreach ($pair in $replacements.GetEnumerator()) {
    $updated = $updated.Replace($pair.Key, $pair.Value)
  }
  if ($updated -ne $content) {
    [System.IO.File]::WriteAllText($file.FullName, $updated, [System.Text.UTF8Encoding]::new($false))
    Write-Output "fixed: $($file.FullName)"
  }
}
