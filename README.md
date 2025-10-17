# API Bancária - Sistema de Gestão Financeira

API RESTful para gerenciamento de clientes, contas bancárias e transações financeiras.

## Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Como Rodar](#como-rodar)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Documentação da API](#documentação-da-api)
- [Como Testar](#como-testar)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Solução de Problemas](#solução-de-problemas)

---

## Tecnologias

- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **dotenv** - Gerenciamento de variáveis de ambiente
- **CORS** - Controle de acesso entre domínios

---

## Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 14 ou superior)
- [MongoDB](https://www.mongodb.com/try/download/community) (versão 4.4 ou superior)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/downloads/) ou [Insomnia](https://insomnia.rest/) (para testes)

### Verificar instalações:

```bash
node --version    # deve mostrar v14.x.x ou superior
npm --version     # deve mostrar 6.x.x ou superior
mongod --version  # deve mostrar versão do MongoDB
```

---

## Instalação

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd apicompass
```

### 2. Instale as dependências

```bash
npm install
```

Isso vai instalar:
- express
- mongoose
- dotenv
- cors
- nodemon (dev)

---

## Configuração

### 1. Crie o arquivo `.env`

Na raiz do projeto, crie um arquivo chamado `.env`:

```bash
touch .env
```

### 2. Configure as variáveis de ambiente

Adicione o seguinte conteúdo ao arquivo `.env`:

```env
# Conexão com MongoDB
MONGODB_URI=mongodb://localhost:27017/api-financeira

# Porta do servidor
PORT=3000

# Ambiente
NODE_ENV=development
```

### 3. Inicie o MongoDB

```bash
# Linux/Mac
sudo systemctl start mongod

# Ou manualmente
mongod

# Windows
# Abra o MongoDB Compass ou inicie o serviço
```

### 4. Verifique se o MongoDB está rodando

```bash
# Linux/Mac
sudo systemctl status mongod

# Ou tente conectar
mongosh
```

---

## Como Rodar

### Desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Produção

```bash
npm start
```

### Saída esperada:

```
MongoDB conectado com sucesso
Servidor rodando na porta 3000
```

### Testar se está funcionando:

Abra o navegador e acesse: `http://localhost:3000`

Você deve ver:
```json
{
  "message": "API Bancária funcionando!"
}
```

---

## Estrutura do Projeto

```
apicompass/
│
├── config/
│   └── database.js          # Configuração do MongoDB
│
├── models/
│   ├── customer.js          # Schema de Cliente
│   ├── account.js           # Schema de Conta
│   └── transaction.js       # Schema de Transação
│
├── routes/
│   ├── customers.js         # Rotas de clientes
│   ├── accounts.js          # Rotas de contas
│   └── transactions.js      # Rotas de transações
│
├── utils/
│   └── generators.js        # Geradores de IDs
│
├── .env                     # Variáveis de ambiente
├── .gitignore              # Arquivos ignorados pelo Git
├── package.json            # Dependências do projeto
├── server.js               # Arquivo principal
└── README.md               # Este arquivo
```

---

## Documentação da API

### Base URL

```
http://localhost:3000
```

---

## CLIENTES (Customers)

### Criar Cliente

**Endpoint:** `POST /customers`

**Body:**
```json
{
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com"
}
```

**Resposta (201):**
```json
{
  "_id": "cus_001",
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com",
  "accounts": []
}
```

---

### Buscar Cliente por ID

**Endpoint:** `GET /customers/:id`

**Exemplo:** `GET /customers/cus_001`

**Resposta (200):**
```json
{
  "_id": "cus_001",
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com",
  "accounts": ["acc_001", "acc_002"]
}
```

---

## CONTAS (Accounts)

### Criar Conta para Cliente

**Endpoint:** `POST /accounts/customers/:customerId/accounts`

**Exemplo:** `POST /accounts/customers/cus_001/accounts`

**Body:**
```json
{
  "type": "Conta Corrente",
  "branch": "0001"
}
```

**Resposta (201):**
```json
{
  "_id": "acc_001",
  "type": "Conta Corrente",
  "branch": "0001",
  "number": "12345-6",
  "balance": 0,
  "transactions": []
}
```

---

### Consultar Saldo

**Endpoint:** `GET /accounts/:id/balance`

**Exemplo:** `GET /accounts/acc_001/balance`

**Resposta (200):**
```json
{
  "accountId": "acc_001",
  "balance": 1000.00
}
```

---

## TRANSAÇÕES (Transactions)

### Criar Transação (Depósito ou Saque)

**Endpoint:** `POST /transactions/accounts/:accountId/transactions`

**Exemplo:** `POST /transactions/accounts/acc_001/transactions`

**Body (Depósito/Crédito):**
```json
{
  "description": "Salário",
  "amount": 5000.00,
  "type": "credit",
  "category": "Salário"
}
```

**Body (Saque/Débito):**
```json
{
  "description": "Saque ATM",
  "amount": 500.00,
  "type": "debit",
  "category": "Saque"
}
```

**Resposta (201):**
```json
{
  "_id": "txn_001",
  "date": "2025-10-17",
  "description": "Salário",
  "amount": 5000,
  "type": "credit",
  "category": "Salário"
}
```

---

### Consultar Extrato

**Endpoint:** `GET /transactions/accounts/:accountId/transactions`

**Exemplo:** `GET /transactions/accounts/acc_001/transactions`

**Resposta (200):**
```json
{
  "accountId": "acc_001",
  "balance": 5500.00,
  "transactions": [
    {
      "_id": "txn_002",
      "date": "2025-10-17",
      "description": "Saque ATM",
      "amount": 500,
      "type": "debit",
      "category": "Saque"
    },
    {
      "_id": "txn_001",
      "date": "2025-10-17",
      "description": "Salário",
      "amount": 5000,
      "type": "credit",
      "category": "Salário"
    }
  ]
}
```

---

## Como Testar

### Método 1: Usando Postman (Recomendado)

#### 1. Importe a Collection

Você pode criar uma collection no Postman com todas as rotas, ou testar uma por uma:

#### 2. Teste Completo - Passo a Passo

**PASSO 1: Criar Cliente**
```
Método: POST
URL: http://localhost:3000/customers
Body (JSON):
{
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "email": "joao.silva@email.com"
}
```

Resultado esperado: Cliente criado com ID `cus_001`

---

**PASSO 2: Criar Conta**
```
Método: POST
URL: http://localhost:3000/accounts/customers/cus_001/accounts
Body (JSON):
{
  "type": "Conta Corrente",
  "branch": "0001"
}
```

Resultado esperado: Conta criada com ID `acc_001` e saldo 0

---

**PASSO 3: Fazer Depósito**
```
Método: POST
URL: http://localhost:3000/transactions/accounts/acc_001/transactions
Body (JSON):
{
  "description": "Depósito inicial",
  "amount": 1000,
  "type": "credit",
  "category": "Depósito"
}
```

Resultado esperado: Transação criada e saldo atualizado para 1000

---

**PASSO 4: Consultar Saldo**
```
Método: GET
URL: http://localhost:3000/accounts/acc_001/balance
```

Resultado esperado: 
```json
{
  "accountId": "acc_001",
  "balance": 1000
}
```

---

**PASSO 5: Fazer Saque**
```
Método: POST
URL: http://localhost:3000/transactions/accounts/acc_001/transactions
Body (JSON):
{
  "description": "Saque ATM",
  "amount": 200,
  "type": "debit",
  "category": "Saque"
}
```

Resultado esperado: Saldo atualizado para 800

---

**PASSO 6: Consultar Extrato**
```
Método: GET
URL: http://localhost:3000/transactions/accounts/acc_001/transactions
```

Resultado esperado: Lista com 2 transações (depósito e saque)

---

### Método 2: Usando cURL (Terminal)

```bash
# Criar cliente
curl -X POST http://localhost:3000/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "email": "joao.silva@email.com"
  }'

# Criar conta
curl -X POST http://localhost:3000/accounts/customers/cus_001/accounts \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Conta Corrente",
    "branch": "0001"
  }'

# Fazer depósito
curl -X POST http://localhost:3000/transactions/accounts/acc_001/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "description": "Depósito inicial",
    "amount": 1000,
    "type": "credit",
    "category": "Depósito"
  }'

# Consultar saldo
curl http://localhost:3000/accounts/acc_001/balance

# Consultar extrato
curl http://localhost:3000/transactions/accounts/acc_001/transactions
```

---

### Método 3: Popular o Banco com Dados de Teste

```bash
npm run seed-db
```

Isso vai criar automaticamente:
- 3 clientes
- 4 contas
- 11 transações

Depois você pode consultar via Postman ou MongoDB.

---

## Verificar no MongoDB

### Via MongoDB Shell

```bash
# Abrir MongoDB Shell
mongosh

# Selecionar banco
use api-financeira

# Ver todos os clientes
db.customers.find().pretty()

# Ver todas as contas
db.accounts.find().pretty()

# Ver todas as transações
db.transactions.find().pretty()

# Contar documentos
db.customers.countDocuments()
db.accounts.countDocuments()
db.transactions.countDocuments()

# Buscar cliente específico
db.customers.findOne({ _id: "cus_001" })

# Ver cliente com suas contas
db.customers.aggregate([
  { $match: { _id: "cus_001" } },
  {
    $lookup: {
      from: "accounts",
      localField: "accounts",
      foreignField: "_id",
      as: "accountDetails"
    }
  }
]).pretty()
```

### Via MongoDB Compass (Interface Gráfica)

1. Abra o MongoDB Compass
2. Conecte em: `mongodb://localhost:27017`
3. Selecione o banco: `api-financeira`
4. Navegue pelas coleções: `customers`, `accounts`, `transactions`

---

## Scripts Disponíveis

```bash
# Iniciar servidor em modo desenvolvimento
npm run dev

# Iniciar servidor em modo produção
npm start

# Popular banco com dados de teste
npm run seed-db

# Resetar banco de dados
npm run reset-db

# Executar diagnóstico do banco
npm run diagnostico
```

### Configurar os scripts no package.json:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "seed-db": "node seed-db.js",
    "reset-db": "node reset-db.js",
    "diagnostico": "node diagnostico-db.js"
  }
}
```

---

## Checklist de Teste

### Clientes
- [ ] Criar cliente com todos os dados
- [ ] Buscar cliente por ID
- [ ] Tentar criar cliente sem nome (deve dar erro)
- [ ] Tentar criar cliente sem CPF (deve dar erro)
- [ ] Tentar criar cliente com CPF duplicado (deve dar erro)
- [ ] Tentar buscar cliente inexistente (deve retornar 404)

### Contas
- [ ] Criar conta corrente
- [ ] Criar conta poupança
- [ ] Criar múltiplas contas para um cliente
- [ ] Consultar saldo de conta
- [ ] Tentar criar conta sem tipo (deve dar erro)
- [ ] Tentar criar conta para cliente inexistente (deve dar erro)

### Transações
- [ ] Fazer depósito (crédito)
- [ ] Fazer saque (débito)
- [ ] Consultar extrato
- [ ] Verificar atualização automática de saldo
- [ ] Tentar saque maior que saldo (deve dar erro)
- [ ] Tentar transação sem descrição (deve dar erro)
- [ ] Verificar ordenação do extrato (mais recente primeiro)

---

## Solução de Problemas

### Erro: "MongoDB não conectado"

```bash
# Verifique se o MongoDB está rodando
sudo systemctl status mongod

# Se não estiver, inicie
sudo systemctl start mongod

# Ou manualmente
mongod
```

### Erro: "Port 3000 already in use"

```bash
# Mude a porta no arquivo .env
PORT=3001

# Ou mate o processo na porta 3000
lsof -ti:3000 | xargs kill -9
```

### Erro: "Cannot find module"

```bash
# Reinstale as dependências
rm -rf node_modules package-lock.json
npm install
```

### Erro: "CPF ou email já cadastrado"

Isso significa que você está tentando criar um cliente com CPF ou email que já existe. Use valores diferentes ou delete o cliente existente.

### Banco de dados vazio

```bash
# Execute o script de seed
npm run seed-db

# Ou crie dados via Postman
```

### Servidor não inicia

```bash
# Verifique se o arquivo .env existe
cat .env

# Verifique se as dependências estão instaladas
npm install

# Verifique se tem erros no código
npm run dev
```

---

## Validações da API

### Cliente
- Nome: obrigatório, string
- CPF: obrigatório, único, string
- Email: obrigatório, único, string

### Conta
- Tipo: obrigatório, string
- Agência: obrigatório, string
- Número: gerado automaticamente, único
- Saldo: padrão 0

### Transação
- Descrição: obrigatório, string
- Valor: obrigatório, number
- Tipo: obrigatório, enum ['credit', 'debit']
- Categoria: obrigatório, string
- Data: gerada automaticamente

---



## Autor

**Rodrigo Santos**

---


## Recursos Adicionais

- [Documentação Node.js](https://nodejs.org/docs/)
- [Documentação Express](https://expressjs.com/)
- [Documentação MongoDB](https://docs.mongodb.com/)
- [Documentação Mongoose](https://mongoosejs.com/)
- [Postman Learning Center](https://learning.postman.com/)

---

**Última atualização:** Outubro 2025
