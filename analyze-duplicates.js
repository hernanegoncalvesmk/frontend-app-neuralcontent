#!/usr/bin/env node

/**
 * Script de Análise de Duplicatas
 * Identifica arquivos duplicados entre frontend-app-neuralcontent e prototipo-trezo-theme
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const projectRoot = 'c:/Users/Hernane/Music/NeuralContent';
const frontend = path.join(projectRoot, 'frontend-app-neuralcontent');
const prototype = path.join(projectRoot, 'prototipo-trezo-theme');

function getFileHash(filePath) {
    try {
        const content = fs.readFileSync(filePath);
        return crypto.createHash('md5').update(content).digest('hex');
    } catch (error) {
        return null;
    }
}

function getAllFiles(dir, fileList = []) {
    try {
        const files = fs.readdirSync(dir);
        
        files.forEach(file => {
            const filePath = path.join(dir, file);
            const stat = fs.statSync(filePath);
            
            if (stat.isDirectory()) {
                // Pular node_modules, .git, .next
                if (!['node_modules', '.git', '.next'].includes(file)) {
                    getAllFiles(filePath, fileList);
                }
            } else {
                fileList.push({
                    path: filePath,
                    relativePath: path.relative(dir, filePath),
                    size: stat.size,
                    hash: getFileHash(filePath)
                });
            }
        });
    } catch (error) {
        console.warn(`Erro ao ler diretório ${dir}:`, error.message);
    }
    
    return fileList;
}

function analyzeProject() {
    console.log('🔍 ANÁLISE DE DUPLICATAS - PROJETO NEURALCONTENT\n');
    
    // Verificar se os diretórios existem
    if (!fs.existsSync(frontend)) {
        console.log('❌ Diretório frontend-app-neuralcontent não encontrado');
        return;
    }
    
    if (!fs.existsSync(prototype)) {
        console.log('❌ Diretório prototipo-trezo-theme não encontrado');
        return;
    }
    
    console.log('📁 Analisando frontend-app-neuralcontent...');
    const frontendFiles = getAllFiles(frontend);
    
    console.log('📁 Analisando prototipo-trezo-theme...');
    const prototypeFiles = getAllFiles(prototype);
    
    console.log(`\n📊 ESTATÍSTICAS:`);
    console.log(`Frontend: ${frontendFiles.length} arquivos`);
    console.log(`Protótipo: ${prototypeFiles.length} arquivos`);
    
    // Encontrar duplicatas por nome
    const duplicatesByName = [];
    const duplicatesByHash = [];
    
    frontendFiles.forEach(frontFile => {
        // Duplicatas por nome de arquivo
        const nameMatch = prototypeFiles.find(protoFile => 
            path.basename(frontFile.path) === path.basename(protoFile.path)
        );
        
        if (nameMatch) {
            duplicatesByName.push({
                name: path.basename(frontFile.path),
                frontend: frontFile.relativePath,
                prototype: nameMatch.relativePath,
                sizeFrontend: frontFile.size,
                sizePrototype: nameMatch.size,
                identical: frontFile.hash === nameMatch.hash
            });
        }
        
        // Duplicatas por conteúdo (hash)
        const hashMatch = prototypeFiles.find(protoFile => 
            frontFile.hash && protoFile.hash && frontFile.hash === protoFile.hash
        );
        
        if (hashMatch && frontFile.relativePath !== hashMatch.relativePath) {
            duplicatesByHash.push({
                hash: frontFile.hash,
                frontend: frontFile.relativePath,
                prototype: hashMatch.relativePath,
                size: frontFile.size
            });
        }
    });
    
    console.log(`\n🔍 DUPLICATAS POR NOME:`);
    console.log(`Total: ${duplicatesByName.length} arquivos\n`);
    
    duplicatesByName.forEach(dup => {
        const status = dup.identical ? '✅ IDÊNTICO' : '⚠️ DIFERENTE';
        console.log(`${status} ${dup.name}`);
        console.log(`  Frontend: ${dup.frontend} (${dup.sizeFrontend} bytes)`);
        console.log(`  Protótipo: ${dup.prototype} (${dup.sizePrototype} bytes)`);
        console.log('');
    });
    
    console.log(`\n🔍 DUPLICATAS POR CONTEÚDO:`);
    console.log(`Total: ${duplicatesByHash.length} arquivos\n`);
    
    duplicatesByHash.forEach(dup => {
        console.log(`📄 ${path.basename(dup.frontend)}`);
        console.log(`  Frontend: ${dup.frontend}`);
        console.log(`  Protótipo: ${dup.prototype}`);
        console.log(`  Tamanho: ${dup.size} bytes`);
        console.log('');
    });
    
    // Estatísticas de economia
    const totalDuplicateSize = duplicatesByHash.reduce((sum, dup) => sum + dup.size, 0);
    console.log(`\n💾 POTENCIAL DE ECONOMIA:`);
    console.log(`Espaço duplicado: ${(totalDuplicateSize / 1024 / 1024).toFixed(2)} MB`);
    
    // Recomendações
    console.log(`\n🎯 RECOMENDAÇÕES:`);
    
    if (duplicatesByName.length > 50) {
        console.log('🚨 ALTA DUPLICAÇÃO DETECTADA!');
        console.log('   Considere consolidar os projetos ou remover o protótipo');
    }
    
    if (duplicatesByHash.length > 20) {
        console.log('⚠️ Muitos arquivos idênticos encontrados');
        console.log('   Recomendado: usar symlinks ou mover para biblioteca compartilhada');
    }
    
    console.log('\n✅ Análise concluída!');
}

// Executar análise
analyzeProject();
