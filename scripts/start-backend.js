#!/usr/bin/env node

/**
 * Script para iniciar o backend automaticamente
 */

const { spawn } = require('child_process');
const path = require('path');

const backendPath = path.resolve(__dirname, '..', 'backend-app-neuralcontent');

console.log('🚀 Iniciando backend NestJS...');
console.log('📁 Diretório:', backendPath);

const backend = spawn('npm', ['run', 'start:dev'], {
  cwd: backendPath,
  stdio: 'inherit',
  shell: true
});

backend.on('error', (error) => {
  console.error('❌ Erro ao iniciar backend:', error);
});

backend.on('close', (code) => {
  console.log(`🛑 Backend finalizado com código: ${code}`);
});

// Handle Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Finalizando backend...');
  backend.kill('SIGINT');
  process.exit(0);
});
