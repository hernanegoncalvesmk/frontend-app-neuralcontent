# 🔐 USUÁRIOS E SENHAS - SISTEMA NEURALCONTENT

## 📋 STATUS ATUAL DO SISTEMA

### ⚠️ **IMPORTANTE**: Sistema em Desenvolvimento
- **Seeds não implementados** - Arquivos de seed estão vazios
- **Usuários não criados** - Não há usuários padrão no sistema
- **Primeiro acesso** - Necessário criar usuários via API

---

## 🛠️ CREDENCIAIS ENCONTRADAS NA DOCUMENTAÇÃO

### 1. **Usuário Admin (Planejado)**
Conforme documentação em `IMPLEMENTACAO_BACKEND_CHECKLIST.md`:

```json
{
  "email": "admin@neuralcontent.com",
  "password": "admin123",
  "role": "admin"
}
```

### 2. **Usuário de Teste (Planejado)**
```json
{
  "email": "test@test.com", 
  "password": "123456",
  "name": "Test User"
}
```

### 3. **Usuário Exemplo (Documentação)**
```json
{
  "email": "test@example.com",
  "password": "Test123!",
  "name": "Test User"
}
```

---

## 🚨 PROBLEMA IDENTIFICADO

### **Seeds Vazios**
- `src/database/seeds/001-users.seed.ts` → **VAZIO**
- `src/database/seeds/run-seeds.ts` → **VAZIO**
- Comando `npm run db:seed` → **NÃO FAZ NADA**

### **Banco de Dados**
- **Host**: 167.235.253.236
- **Usuário**: app_NeuralContent_8785
- **Senha**: 6ZUFqq4o2FsFkFtF
- **Database**: app_NeuralContent_8785

---

## 🔧 SOLUÇÕES PARA ACESSAR O SISTEMA

### **OPÇÃO 1: Criar Usuário via API**
```bash
# 1. Iniciar o backend
cd backend-app-neuralcontent
npm run start:dev

# 2. Registrar novo usuário
curl -X POST http://localhost:3001/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neuralcontent.com","password":"admin123","name":"Admin User"}'

# 3. Fazer login
curl -X POST http://localhost:3001/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@neuralcontent.com","password":"admin123"}'
```

### **OPÇÃO 2: Implementar Seeds (Recomendado)**
```typescript
// src/database/seeds/001-users.seed.ts
import { DataSource } from 'typeorm';
import { User } from '../../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export class UsersSeed {
  public async run(dataSource: DataSource): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    
    // Admin user
    const adminUser = userRepository.create({
      email: 'admin@neuralcontent.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
      role: 'admin',
      status: 'active',
      emailVerified: true
    });
    
    await userRepository.save(adminUser);
    console.log('✅ Admin user created: admin@neuralcontent.com');
  }
}
```

### **OPÇÃO 3: Acesso via Frontend**
```bash
# 1. Iniciar frontend
cd frontend-app-neuralcontent
npm run dev

# 2. Acessar: http://localhost:3002/auth/register
# 3. Criar conta manualmente
```

---

## 📝 PRÓXIMOS PASSOS RECOMENDADOS

### **1. Implementar Seeds**
- [ ] Criar seed para usuário admin
- [ ] Criar seed para planos básicos
- [ ] Executar seeds no deploy

### **2. Melhorar Segurança**
- [ ] Alterar senha padrão do admin
- [ ] Implementar força de senha
- [ ] Adicionar verificação de email

### **3. Documentar Acesso**
- [ ] Criar guia de primeiro acesso
- [ ] Documentar processo de recuperação
- [ ] Criar usuários de demonstração

---

## 🎯 **RESPOSTA DIRETA**

### **Para acessar o sistema AGORA:**

1. **Registre-se pelo frontend**: http://localhost:3002/auth/register
2. **Ou use a API diretamente** com os dados:
   - Email: Qualquer email válido
   - Senha: Mínimo 6 caracteres
   
3. **Credenciais planejadas** (se seeds funcionassem):
   - **Admin**: admin@neuralcontent.com / admin123
   - **Teste**: test@test.com / 123456

### **Status atual**: ❌ **Seeds não implementados**
### **Solução**: ✅ **Criar conta via registro**

---
*Análise realizada em: ${new Date().toLocaleString('pt-BR')}*
