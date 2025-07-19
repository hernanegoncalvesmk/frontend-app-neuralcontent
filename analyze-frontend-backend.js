const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Diretórios dos projetos principais
const frontendDir = path.join(__dirname);
const backendDir = path.join(__dirname, '..', 'backend-app-neuralcontent');

// Função para calcular hash MD5 de um arquivo
function calculateFileHash(filePath) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
  } catch (error) {
    return null;
  }
}

// Função para listar arquivos recursivamente
function listFiles(dir, basePath = '', excludeDirs = []) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const relativePath = path.join(basePath, item);
    
    if (fs.statSync(fullPath).isDirectory()) {
      // Pular diretórios específicos
      if (excludeDirs.includes(item)) {
        continue;
      }
      
      // Recursão para subdiretórios
      files.push(...listFiles(fullPath, relativePath, excludeDirs));
    } else {
      const stats = fs.statSync(fullPath);
      files.push({
        name: item,
        path: relativePath,
        fullPath: fullPath,
        size: stats.size,
        hash: calculateFileHash(fullPath)
      });
    }
  }
  
  return files;
}

// Função principal de análise
function analyzeDuplicates() {
  console.log('🔍 ANÁLISE DE DUPLICATAS - FRONTEND vs BACKEND');
  console.log('================================================');
  
  // Listar arquivos dos projetos
  const excludeDirs = [
    'node_modules', 
    '.next', 
    '.git', 
    'dist', 
    'build', 
    'coverage',
    'logs',
    '.vscode',
    '.idea'
  ];
  
  console.log('📁 Analisando frontend-app-neuralcontent...');
  const frontendFiles = listFiles(frontendDir, '', excludeDirs);
  
  console.log('📁 Analisando backend-app-neuralcontent...');
  const backendFiles = listFiles(backendDir, '', excludeDirs);
  
  console.log('\n📊 ESTATÍSTICAS:');
  console.log(`Frontend: ${frontendFiles.length} arquivos`);
  console.log(`Backend: ${backendFiles.length} arquivos`);
  
  // Análise por nome de arquivo
  console.log('\n🔍 DUPLICATAS POR NOME:');
  const frontendByName = new Map();
  const backendByName = new Map();
  
  // Mapear arquivos por nome
  frontendFiles.forEach(file => {
    if (!frontendByName.has(file.name)) {
      frontendByName.set(file.name, []);
    }
    frontendByName.get(file.name).push(file);
  });
  
  backendFiles.forEach(file => {
    if (!backendByName.has(file.name)) {
      backendByName.set(file.name, []);
    }
    backendByName.get(file.name).push(file);
  });
  
  let duplicatesByName = 0;
  let identicalFiles = 0;
  let differentFiles = 0;
  
  // Comparar arquivos com mesmo nome
  for (const [filename, frontFiles] of frontendByName) {
    if (backendByName.has(filename)) {
      const backFiles = backendByName.get(filename);
      duplicatesByName++;
      
      // Comparar por conteúdo (hash)
      let foundIdentical = false;
      for (const frontFile of frontFiles) {
        for (const backFile of backFiles) {
          if (frontFile.hash && backFile.hash && frontFile.hash === backFile.hash) {
            console.log(`✅ IDÊNTICO ${filename}`);
            console.log(`  Frontend: ${frontFile.path} (${frontFile.size} bytes)`);
            console.log(`  Backend: ${backFile.path} (${backFile.size} bytes)`);
            identicalFiles++;
            foundIdentical = true;
            break;
          }
        }
        if (foundIdentical) break;
      }
      
      if (!foundIdentical) {
        console.log(`⚠️ DIFERENTE ${filename}`);
        frontFiles.forEach(f => console.log(`  Frontend: ${f.path} (${f.size} bytes)`));
        backFiles.forEach(f => console.log(`  Backend: ${f.path} (${f.size} bytes)`));
        differentFiles++;
      }
    }
  }
  
  console.log(`\nTotal: ${duplicatesByName} arquivos com nomes duplicados`);
  console.log(`Idênticos: ${identicalFiles}`);
  console.log(`Diferentes: ${differentFiles}`);
  
  // Análise por conteúdo (mesmo hash, nomes diferentes)
  console.log('\n🔍 DUPLICATAS POR CONTEÚDO (nomes diferentes):');
  const frontendByHash = new Map();
  const backendByHash = new Map();
  
  frontendFiles.forEach(file => {
    if (file.hash) {
      if (!frontendByHash.has(file.hash)) {
        frontendByHash.set(file.hash, []);
      }
      frontendByHash.get(file.hash).push(file);
    }
  });
  
  backendFiles.forEach(file => {
    if (file.hash) {
      if (!backendByHash.has(file.hash)) {
        backendByHash.set(file.hash, []);
      }
      backendByHash.get(file.hash).push(file);
    }
  });
  
  let contentDuplicates = 0;
  let totalDuplicateSize = 0;
  
  for (const [hash, frontFiles] of frontendByHash) {
    if (backendByHash.has(hash)) {
      const backFiles = backendByHash.get(hash);
      
      // Verificar se não são o mesmo arquivo já listado por nome
      const frontFile = frontFiles[0];
      const backFile = backFiles[0];
      
      if (frontFile.name !== backFile.name) {
        console.log(`📄 Conteúdo idêntico:`);
        console.log(`  Frontend: ${frontFile.path} (${frontFile.size} bytes)`);
        console.log(`  Backend: ${backFile.path} (${backFile.size} bytes)`);
        contentDuplicates++;
        totalDuplicateSize += frontFile.size;
      }
    }
  }
  
  console.log(`\nTotal: ${contentDuplicates} arquivos com conteúdo duplicado`);
  
  // Estatísticas finais
  console.log('\n💾 POTENCIAL DE ECONOMIA:');
  console.log(`Espaço duplicado: ${(totalDuplicateSize / (1024 * 1024)).toFixed(2)} MB`);
  
  // Recomendações específicas
  console.log('\n🎯 RECOMENDAÇÕES PARA FRONTEND vs BACKEND:');
  
  if (identicalFiles > 0) {
    console.log(`✅ ${identicalFiles} arquivos idênticos encontrados`);
    console.log('   - Considere mover para pasta compartilhada');
    console.log('   - Ou criar symlinks para evitar duplicação');
  }
  
  if (differentFiles > 0) {
    console.log(`⚠️ ${differentFiles} arquivos com nomes iguais mas conteúdo diferente`);
    console.log('   - Revisar se são versões diferentes');
    console.log('   - Sincronizar se necessário');
  }
  
  if (contentDuplicates > 0) {
    console.log(`🔄 ${contentDuplicates} arquivos com conteúdo idêntico mas nomes diferentes`);
    console.log('   - Padronizar nomenclatura');
    console.log('   - Remover duplicatas desnecessárias');
  }
  
  console.log('\n✅ Análise concluída!');
}

// Executar análise
analyzeDuplicates();
