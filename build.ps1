# Skargrid Build Script
$ErrorActionPreference = "Stop"

Write-Host "Iniciando build..." -ForegroundColor Cyan

# Diretorios
$src = "src"
$dist = "dist"

# Cria dist
if (Test-Path $dist) {
    # Limpa dist antes de build
    Remove-Item $dist -Recurse -Force
}
New-Item -ItemType Directory -Path $dist | Out-Null

# Header (mantém para desenvolvimento/debugging)
$header = @"
/**
 * Skargrid
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

# Header minificado (sem comentários para produção)
$headerMin = @"
(function(global,factory){if(typeof module==="object"&&module.exports){module.exports=factory()}else{global.Skargrid=factory()}}(typeof self!=="undefined"?self:this,function(){
"@

Write-Host "Concatenando arquivos..." -ForegroundColor Yellow
Write-Host "Concatenando arquivos..." -ForegroundColor Yellow

# Lê os arquivos com UTF-8
$pagination = Get-Content "$src\features\pagination.js" -Raw -Encoding UTF8
$sort = Get-Content "$src\features\sort.js" -Raw -Encoding UTF8
$selection = Get-Content "$src\features\selection.js" -Raw -Encoding UTF8
$filter = Get-Content "$src\features\filter.js" -Raw -Encoding UTF8
$selectFilter = Get-Content "$src\features\select-filter.js" -Raw -Encoding UTF8
$virtualization = Get-Content "$src\features\virtualization.js" -Raw -Encoding UTF8
$columnConfig = Get-Content "$src\features\columnConfig.js" -Raw -Encoding UTF8
$export = Get-Content "$src\features\export.js" -Raw -Encoding UTF8
$core = Get-Content "$src\core\skargrid.js" -Raw -Encoding UTF8

# Remove exports dos features
$pagination = $pagination -replace "(?s)if \(typeof window.*?$", ""
$sort = $sort -replace "(?s)if \(typeof window.*?$", ""
$selection = $selection -replace "(?s)if \(typeof window.*?$", ""
$filter = $filter -replace "(?s)if \(typeof window.*?$", ""
$selectFilter = $selectFilter -replace "(?s)if \(typeof window.*?$", ""
$virtualization = $virtualization -replace "(?s)if \(typeof window.*?$", ""
$columnConfig = $columnConfig -replace "export function initColumnConfig.*?\{", "function initColumnConfig(grid) {"
$columnConfig = $columnConfig -replace "(?s)if \(typeof window.*?$", ""
$export = $export -replace "(?s)if \(typeof window.*?$", ""

 # Renomeia ScarGridCore para Skargrid no core
$core = $core -replace "class ScarGridCore", "class Skargrid"
$core = $core -replace "(?s)if \(typeof window.*?$", ""

# Monta o bundle (versão de desenvolvimento)
$bundle = @"
$header
$core
$pagination
$sort
$selection
$filter
$selectFilter
$virtualization
$columnConfig
$export

return Skargrid;
}));
"@

# Salva versão de desenvolvimento (skargrid.js)
# $devBundlePath = "$dist\skargrid.js"
$utf8NoBom = New-Object System.Text.UTF8Encoding $false
# [System.IO.File]::WriteAllText($devBundlePath, $bundle, $utf8NoBom)

# Monta o bundle minificado (versão de produção)
$minBundle = @"
$headerMin
$core
$pagination
$sort
$selection
$filter
$selectFilter
$virtualization
$columnConfig
$export

return Skargrid;
}));
"@

# Salva versão não minificada temporária para o Terser
$tempBundlePath = "$dist\skargrid.temp.js"
[System.IO.File]::WriteAllText($tempBundlePath, $minBundle, $utf8NoBom)

# Minifica com Terser
Write-Host "Minificando JavaScript..." -ForegroundColor Yellow
$minBundlePath = "$dist\skargrid.min.js"

# Executa Terser via npx
npx terser "$tempBundlePath" --compress --mangle --output "$minBundlePath" --comments false

# Remove arquivo temporário
Remove-Item $tempBundlePath

$size = [math]::Round((Get-Item $minBundlePath).Length / 1KB, 2)
Write-Host "Bundle minificado criado: $minBundlePath ($size KB)" -ForegroundColor Green

# Copia CSS (versão de desenvolvimento)
Write-Host "Copiando CSS..." -ForegroundColor Yellow
# Copy-Item "$src\css\skargrid.css" "$dist\skargrid.css"  # Removido para economizar espaço

# Minifica CSS
Write-Host "Minificando CSS..." -ForegroundColor Yellow
npx cleancss "$src\css\skargrid.css" -o "$dist\skargrid.min.css"

# Copia temas
# if (!(Test-Path "$dist\themes")) {
#     New-Item -ItemType Directory -Path "$dist\themes" | Out-Null
# }
# Copy-Item "$src\css\themes\*.css" "$dist\themes\"  # Removido para economizar espaço

# Minifica temas
# Write-Host "Minificando temas..." -ForegroundColor Yellow
# npx cleancss "$src\css\themes\dark.css" -o "$dist\themes\dark.min.css"
# npx cleancss "$src\css\themes\light.css" -o "$dist\themes\light.min.css"

Write-Host "Build completo!" -ForegroundColor Green
Write-Host "Arquivos em dist/:" -ForegroundColor Cyan
Get-ChildItem $dist -Recurse -File | ForEach-Object { Write-Host "  - $($_.FullName.Replace((Get-Location).Path + '\', ''))" }
