# ANALISE DE DUPLICATAS INTERNAS - FRONTEND NEURALCONTENT
# Analisa duplicatas APENAS dentro do diretorio frontend-app-neuralcontent

Write-Host "ANALISE DE DUPLICATAS INTERNAS - FRONTEND" -ForegroundColor Green
Write-Host "=================================================="

$duplicatesByName = @{}
$duplicatesByHash = @{}
$totalSize = 0
$duplicateSize = 0

# Buscar todos os arquivos
$files = Get-ChildItem -Recurse -File | Where-Object { 
    $_.Extension -match '\.(js|ts|tsx|jsx|css|scss|png|jpg|jpeg|gif|svg|ico|json|md|txt|html)$' 
}

Write-Host "TOTAL DE ARQUIVOS ANALISADOS: $($files.Count)" -ForegroundColor Yellow

# Agrupar por nome
foreach ($file in $files) {
    $totalSize += $file.Length
    
    if ($duplicatesByName.ContainsKey($file.Name)) {
        $duplicatesByName[$file.Name] += @($file)
    } else {
        $duplicatesByName[$file.Name] = @($file)
    }
}

# Agrupar por hash (conteúdo)
foreach ($file in $files) {
    try {
        $hash = Get-FileHash -Path $file.FullName -Algorithm MD5
        if ($duplicatesByHash.ContainsKey($hash.Hash)) {
            $duplicatesByHash[$hash.Hash] += @($file)
        } else {
            $duplicatesByHash[$hash.Hash] = @($file)
        }
    } catch {
        Write-Warning "Erro ao calcular hash para: $($file.FullName)"
    }
}

# Relatorio de duplicatas por nome
Write-Host "`nDUPLICATAS POR NOME:" -ForegroundColor Cyan
$nameCount = 0
foreach ($name in $duplicatesByName.Keys) {
    if ($duplicatesByName[$name].Count -gt 1) {
        $nameCount++
        $size = ($duplicatesByName[$name] | Measure-Object -Property Length -Sum).Sum
        $duplicateSize += $size * ($duplicatesByName[$name].Count - 1)
        
        Write-Host "  $name ($($duplicatesByName[$name].Count) copias - $(($size/1KB).ToString('N2')) KB)" -ForegroundColor Yellow
        
        foreach ($file in $duplicatesByName[$name]) {
            $relativePath = $file.FullName.Replace((Get-Location).Path, "")
            Write-Host "    -> $relativePath" -ForegroundColor Gray
        }
        Write-Host ""
    }
}

# Relatorio de duplicatas por conteudo
Write-Host "DUPLICATAS POR CONTEUDO (mesmo conteudo, nomes diferentes):" -ForegroundColor Cyan
$contentCount = 0
foreach ($hash in $duplicatesByHash.Keys) {
    if ($duplicatesByHash[$hash].Count -gt 1) {
        # Verificar se nao sao apenas duplicatas por nome
        $uniqueNames = ($duplicatesByHash[$hash] | Select-Object -Property Name -Unique).Count
        if ($uniqueNames -gt 1) {
            $contentCount++
            $size = $duplicatesByHash[$hash][0].Length
            
            Write-Host "  Hash: $($hash.Substring(0,8))... ($(($size/1KB).ToString('N2')) KB cada)" -ForegroundColor Yellow
            foreach ($file in $duplicatesByHash[$hash]) {
                $relativePath = $file.FullName.Replace((Get-Location).Path, "")
                Write-Host "    -> $($file.Name) - $relativePath" -ForegroundColor Gray
            }
            Write-Host ""
        }
    }
}

# Relatorio final
Write-Host "=================================================="
Write-Host "RESUMO DA ANALISE:" -ForegroundColor Green
Write-Host "Total de arquivos: $($files.Count)"
Write-Host "Duplicatas por nome: $nameCount grupos"
Write-Host "Duplicatas por conteudo: $contentCount grupos"
Write-Host "Tamanho total: $(($totalSize/1MB).ToString('N2')) MB"
Write-Host "Espaco desperdicado: $(($duplicateSize/1MB).ToString('N2')) MB"
Write-Host "Potencial economia: $(($duplicateSize * 100 / $totalSize).ToString('N2'))%"

# Salvar relatorio
$reportPath = "duplicates-internal-report.txt"
$report = @"
ANALISE DE DUPLICATAS INTERNAS - FRONTEND NEURALCONTENT
Data: $(Get-Date)
Diretorio: $(Get-Location)

ESTATISTICAS:
Total de arquivos analisados: $($files.Count)
Duplicatas por nome: $nameCount grupos
Duplicatas por conteudo: $contentCount grupos
Tamanho total: $(($totalSize/1MB).ToString('N2')) MB
Espaco desperdicado: $(($duplicateSize/1MB).ToString('N2')) MB
Potencial economia: $(($duplicateSize * 100 / $totalSize).ToString('N2'))%

"@

$report | Out-File -FilePath $reportPath -Encoding UTF8
Write-Host "Relatorio salvo em: $reportPath" -ForegroundColor Green
