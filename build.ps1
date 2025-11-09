# Skargrid Build Script
$ErrorActionPreference = "Stop"

Write-Host "Iniciando build..." -ForegroundColor Cyan

# Diretorios
$src = "src"
$dist = "dist"

# Cria dist
if (!(Test-Path $dist)) {
    New-Item -ItemType Directory -Path $dist | Out-Null
}

# Header
$header = @"
/**
 * Skargrid v1.0.0
 * Build completo - Arquivo unico para uso em producao
 */
(function(global, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    global.Skargrid = factory();
  }
}(typeof self !== 'undefined' ? self : this, function() {

"@

Write-Host "Concatenando arquivos..." -ForegroundColor Yellow

# Lê os arquivos com UTF-8
$pagination = Get-Content "$src\features\pagination.js" -Raw -Encoding UTF8
$sort = Get-Content "$src\features\sort.js" -Raw -Encoding UTF8
$selection = Get-Content "$src\features\selection.js" -Raw -Encoding UTF8
$filter = Get-Content "$src\features\filter.js" -Raw -Encoding UTF8
$columnConfig = Get-Content "$src\features\columnConfig.js" -Raw -Encoding UTF8
$export = Get-Content "$src\features\export.js" -Raw -Encoding UTF8
$core = Get-Content "$src\core\skargrid.js" -Raw -Encoding UTF8

# Remove exports dos features
$pagination = $pagination -replace "(?s)if \(typeof window.*?$", ""
$sort = $sort -replace "(?s)if \(typeof window.*?$", ""
$selection = $selection -replace "(?s)if \(typeof window.*?$", ""
$filter = $filter -replace "(?s)if \(typeof window.*?$", ""
$columnConfig = $columnConfig -replace "export function initColumnConfig.*?\{", "function initColumnConfig(grid) {"
$columnConfig = $columnConfig -replace "(?s)if \(typeof window.*?$", ""
$export = $export -replace "(?s)if \(typeof window.*?$", ""

 # Renomeia ScarGridCore para Skargrid no core
$core = $core -replace "class ScarGridCore", "class Skargrid"
$core = $core -replace "(?s)if \(typeof window.*?$", ""

# Monta o bundle

$bundle = @"
$header
$core
$pagination
$sort
$selection
$filter
$columnConfig
$export

return Skargrid;
}));
"@

# Salva com UTF-8 sem BOM
$bundlePath = "$dist\skargrid.min.js"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
[System.IO.File]::WriteAllText($bundlePath, $bundle, $utf8NoBom)

$size = [math]::Round((Get-Item $bundlePath).Length / 1KB, 2)
Write-Host "Bundle criado: $bundlePath ($size KB)" -ForegroundColor Green

# Copia CSS
Write-Host "Copiando CSS..." -ForegroundColor Yellow
Copy-Item "$src\css\skargrid.css" "$dist\skargrid.css"

# Copia temas
if (!(Test-Path "$dist\themes")) {
    New-Item -ItemType Directory -Path "$dist\themes" | Out-Null
}
Copy-Item "$src\css\themes\*.css" "$dist\themes\"

Write-Host "Build completo!" -ForegroundColor Green
Write-Host "Arquivos em dist/:" -ForegroundColor Cyan
Get-ChildItem $dist -Recurse -File | ForEach-Object { Write-Host "  - $($_.FullName.Replace((Get-Location).Path + '\', ''))" }
