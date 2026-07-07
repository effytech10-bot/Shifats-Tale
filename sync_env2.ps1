$content = Get-Content .env.local
foreach ($line in $content) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith("#")) { continue }
    $index = $line.IndexOf("=")
    if ($index -lt 0) { continue }
    
    $key = $line.Substring(0, $index).Trim()
    $value = $line.Substring($index + 1).Trim()
    
    if ($key -eq "VERCEL_OIDC_TOKEN") { continue }
    if ($key -eq "NEXT_PUBLIC_APP_URL") { continue }
    
    if ($value.StartsWith('"') -and $value.EndsWith('"')) {
        $value = $value.Substring(1, $value.Length - 2)
    }
    
    Write-Host "Removing $key..."
    npx vercel env rm $key production -y
    
    Write-Host "Adding $key..."
    $value | npx vercel env add $key production
}
Write-Host "Sync Complete!"
