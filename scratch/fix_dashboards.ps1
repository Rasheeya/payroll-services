$files = @("d:\payroll\admin dashboard.html", "d:\payroll\client dashboard.html")

foreach ($file in $files) {
    $html = Get-Content $file -Raw

    $prefixIndex = $html.IndexOf("<div id='view-")
    if ($prefixIndex -lt 0) { continue }
    $prefix = $html.Substring(0, $prefixIndex)
    
    $mainIndex = $html.IndexOf("</main>")
    if ($mainIndex -lt 0) { continue }
    $suffix = $html.Substring($mainIndex)

    # We only want to process the string between the first view and </main>
    $viewsSection = $html.Substring($prefixIndex, $mainIndex - $prefixIndex)

    $views = @()
    # Match each view up to the next view or the end of the section
    $viewMatches = [regex]::Matches($viewsSection, "(?i)<div id='view-[\s\S]*?(?=(<div id='view-|$))")
    
    foreach ($match in $viewMatches) {
        $viewHtml = $match.Value
        
        $opens = ([regex]::Matches($viewHtml, '(?i)<div(?![^>]*/>)[^>]*>')).Count
        $closes = ([regex]::Matches($viewHtml, '(?i)</div>')).Count
        
        $diff = $opens - $closes
        if ($diff -gt 0) {
            for ($i = 0; $i -lt $diff; $i++) {
                $viewHtml += "`n</div>"
            }
        } elseif ($diff -lt 0) {
            for ($i = 0; $i -lt (-$diff); $i++) {
                $viewHtml = $viewHtml -replace '(?i)</div>\s*$', ''
            }
        }
        
        $views += $viewHtml
    }

    $newHtml = $prefix + ($views -join "`n") + "`n" + $suffix

    # Also add window.scrollTo(0,0) to switchView
    if ($newHtml -notmatch 'window\.scrollTo\(0,\s*0\)') {
        $newHtml = $newHtml -replace "(targetView\.style\.display = 'block';)", "`$1`n        window.scrollTo(0, 0);"
    }

    Set-Content $file $newHtml
}
Write-Host "Dashboards fixed!"
