# Product Engineering System

Sistema de gerenciamento de engenharia de produto para indústria moveleira, com arquitetura hexagonal e assistente IA local integrado.

## 📋 Índice

- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Configuração do Assistente IA Local](#configuração-do-assistente-ia-local)
- [Instalação e Execução](#instalação-e-execução)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Arquitetura](#arquitetura)

---

## 🛠️ Tecnologias

### Backend
- **Java 17**
- **Spring Boot 3.1.0**
- **PostgreSQL** (banco de dados)
- **Flyway** (migrations)
- **Apache HttpClient 5** (integração com Ollama)
- **Lombok** (redução de boilerplate)

### Frontend
- **React 18.2**
- **TypeScript**
- **Vite** (build tool)
- **Axios** (HTTP client)
- **React Router** (navegação)
- **React Icons** (ícones)
- **date-fns** (formatação de datas)

### IA Local
- **Ollama** (servidor LLM local)
- **Llama 3.2 3B** (modelo de linguagem)

---

## 📦 Pré-requisitos

### Requisitos de Hardware (Mínimo)
- **CPU**: Intel Core i5 ou equivalente
- **RAM**: 8 GB (16 GB recomendado)
- **GPU**: NVIDIA com 4GB VRAM (opcional, mas acelera o LLM)
- **Disco**: 10 GB livres (modelo LLM + aplicação)

### Software - Opção Docker (Recomendado)
- **Docker Desktop** (Windows/Mac) ou **Docker Engine** (Linux)
- **Docker Compose** 2.0+
- **Git**

### Software - Opção Local
- **Java 17 JDK**
- **Maven 3.8+**
- **Node.js 18+ e npm**
- **PostgreSQL 14+**
- **Git**

---

## 🤖 Configuração do Assistente IA Local

O sistema inclui um assistente IA que roda **100% localmente** usando Ollama, garantindo:
- ✅ **Custo zero** (sem APIs externas pagas)
- ✅ **Privacidade total** (dados não saem do servidor)
- ✅ **Sem dependência de internet**

### 1. Instalação do Ollama

#### Windows

**Passo 1:** Baixe o instalador:
- Acesse: https://ollama.com/download
- Baixe o instalador para Windows
- Execute o instalador (ele instala Ollama como serviço do Windows)

**Passo 2:** Verifique a instalação
```bash
ollama --version
```

**Passo 3:** O Ollama já estará rodando automaticamente como serviço do Windows em `http://localhost:11434`

#### Linux/Mac

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve
```

### 2. Download do Modelo LLM

Baixe o modelo Llama 3.2 3B (aproximadamente 2GB):

```bash
ollama pull llama3.2:3b
```

**Aguarde o download completar.** Verifique se está instalado:

```bash
ollama list
```

Você deve ver `llama3.2:3b` na lista.

### 3. Teste Rápido

Teste se o Ollama está funcionando:

```bash
ollama run llama3.2:3b "Olá, diga apenas 'funcionando'"
```

Se retornar uma resposta, está pronto! ✅

---

## 🔧 Gerenciamento do Serviço Ollama (Windows)

O Ollama é instalado como **serviço do Windows** e inicia automaticamente. Ele consome:
- **~100-200 MB RAM** quando idle (sem uso)
- **~4-6 GB RAM** quando processando (modelo carregado)
- **0% CPU/GPU** quando idle

### Opções de Gerenciamento

#### Opção 1: Desabilitar Inicialização Automática

Se quiser iniciar o Ollama **manualmente** apenas quando usar o sistema:

```powershell
# No PowerShell como Administrador:
sc config OllamaService start= demand
```

Para iniciar quando precisar:
```bash
net start OllamaService
```

Para parar quando terminar:
```bash
net stop OllamaService
```

#### Opção 2: Parar o Serviço Temporariamente

```bash
net stop OllamaService
```

#### Opção 3: Voltar para Inicialização Automática

```powershell
# No PowerShell como Administrador:
sc config OllamaService start= auto
net start OllamaService
```

#### Verificar Status do Serviço

```bash
sc query OllamaService
```

### Recomendações

- **16GB+ RAM**: Deixe automático se vai usar o assistente frequentemente
- **8GB RAM**: Configure para inicialização manual (demand) para economizar recursos
- **Desenvolvimento**: Mantenha automático para conveniência
- **Produção**: Configure automático e monitore consumo de recursos

---

## 🚀 Instalação e Execução

### Opção 1: Docker Compose (Recomendado)

A forma mais rápida de rodar o sistema completo (backend, frontend, PostgreSQL e Ollama).

#### Pré-requisitos Docker
- **Docker Desktop** instalado (Windows/Mac) ou **Docker Engine** (Linux)
- **Docker Compose** 2.0+
- **8GB RAM mínimo** (16GB recomendado para Ollama)

#### Passos

**1. Clone o Repositório**

```bash
git clone <url-do-repositorio>
cd ProductEngineering
```

**2. Inicie todos os serviços**

```bash
docker-compose up -d
```

Aguarde alguns minutos enquanto:
- Postgres inicia e cria o banco de dados
- Ollama inicia e fica pronto
- Backend compila e executa migrations
- Frontend compila e inicia

**3. Baixe o modelo LLM (primeira vez)**

```bash
docker exec productengineering-ollama ollama pull llama3.2:3b
```

Aguarde o download do modelo (~2GB).

**4. Acesse o sistema**

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8080
- **Ollama**: http://localhost:11434

**Gerenciar containers:**

```bash
# Ver status dos serviços
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar (mantém dados)
docker-compose down

# Parar e remover volumes (apaga dados)
docker-compose down -v

# Rebuild após mudanças no código
docker-compose up -d --build
```

**Portas utilizadas:**
- `5173` - Frontend React
- `8080` - Backend Spring Boot
- `5433` - PostgreSQL (mapeado para evitar conflito com instalação local)
- `11434` - Ollama API

**Conectar ao PostgreSQL do container:**
- Host: `localhost`
- Port: `5433`
- Database: `productengineering`
- Username: `postgres`
- Password: `postgres`

---

### Opção 2: Execução Local (Desenvolvimento)

Para desenvolvimento com hot-reload e debug.

#### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd ProductEngineering
```

#### 2. Configure o Banco de Dados

Crie o banco PostgreSQL:

```sql
CREATE DATABASE productengineering;
```

Configure as credenciais em `productengineering/webapi/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/productengineering
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
```

#### 3. Backend (Spring Boot)

```bash
cd productengineering
mvn clean install
mvn spring-boot:run -pl webapi
```

O backend estará rodando em: **http://localhost:8080**

#### 4. Frontend (React)

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando em: **http://localhost:5173**

#### 5. Ollama (Local)

Instale e configure conforme seção [Configuração do Assistente IA Local](#configuração-do-assistente-ia-local).

#### 6. Acesse o Sistema

Abra o navegador em **http://localhost:5173** e faça login.

O **ChatWidget** do assistente IA aparecerá no canto inferior direito após autenticação.

---

## ✨ Funcionalidades Principais

### Gestão de Materiais
- **Chapas MDP** (`/sheets`) - Cadastro de chapas de madeira
- **Fitas de Borda** (`/edgebandings`) - Acabamentos
- **Materiais diversos** - MDF, Alumínio, Embalagens

### Gestão de Itens
- **Itens Pai** (`/fathers`) - Produtos principais
- **Itens Filho** (`/sons`) - Componentes
- **Roteiros** (`/guides`) - Sequências de produção

### Cadastros Auxiliares
- **Cores** (`/colors`)
- **Modelos** (`/models`)
- **Medidas** (`/measures`)
- **Máquinas** (`/machines`)
- **Acessórios** (`/accessories`)

### Estruturas
- **Geração de BOM** (`/homestructs`) - Bill of Materials
- **Roteiros de Produção** - Operações e sequências

### 🤖 Assistente IA (Novo!)

**Widget de chat flutuante** que fornece:
- ✅ Ajuda contextual baseada na página atual
- ✅ Respostas sobre funcionalidades do sistema
- ✅ Guia de navegação (onde cadastrar itens, materiais, etc.)
- ✅ Histórico de conversas persistido
- ✅ Detecção automática de contexto
- ✅ Totalmente offline e privado

**Como usar:**
1. Faça login no sistema
2. Clique no ícone de chat no canto inferior direito
3. Digite sua pergunta (ex: "onde cadastrar uma chapa?")
4. O assistente responde em segundos com informações relevantes

**Exemplos de perguntas:**
- "Como cadastrar uma nova chapa MDP?"
- "Onde está a página de roteiros?"
- "Qual a diferença entre Item Pai e Item Filho?"
- "Como criar uma estrutura (BOM)?"

---

## 🏗️ Arquitetura

### Backend - Arquitetura Hexagonal (Ports & Adapters)

```
productengineering/
├── domain/          # Lógica de negócio pura (sem dependências externas)
├── persistence/     # Implementações (JPA, repositories, integrations)
└── webapi/         # Controllers REST, configurações Spring
```

**Fluxo de dados:**
```
Controller → Domain Service → Persistence → Database
                ↓
            LLM Integration (Ollama)
```

### Frontend - Componentização React

```
frontend/src/
├── components/      # Componentes reutilizáveis
├── hooks/          # Custom hooks (useAssistant, etc.)
├── services/       # Integração com backend (Axios)
├── routes/         # Páginas da aplicação
└── utils/          # Utilitários
```

### Assistente IA - Arquitetura

```
Frontend (ChatWidget)
    ↓ HTTP POST /api/assistant/chat
Backend (AssistantController)
    ↓ EnviarMensagem
AssistantServiceImpl
    ↓ buildPrompt (context-aware)
ContextProvider
    ↓ generate
OllamaIntegrationService
    ↓ HTTP POST localhost:11434/api/generate
Ollama (Llama 3.2 3B)
    ↓ resposta
PostgreSQL (persistência)
```

**Características:**
- **Context-Aware**: Detecta pathname atual e adapta respostas
- **Transacional**: Garante atomicidade (mensagem user + resposta assistant)
- **Error Handling**: Trata timeout (504) e offline (503) graciosamente
- **Logging**: Monitora latência e performance

---

## 📊 Requisitos de Performance

### Assistente IA
- **Latência esperada**: 2-5 segundos por resposta
- **Timeout configurado**: 10 segundos
- **Concorrência**: Suporta múltiplos usuários (recursos permitem)

### Sistema
- **Banco de dados**: PostgreSQL com indexação otimizada
- **Cache**: Spring Cache para queries frequentes
- **Build frontend**: Otimizado com Vite (code splitting)

---

## 🔒 Segurança

- **Autenticação**: OAuth2 + JWT
- **Autorização**: Role-based (ADMIN, ANALYST, OPERATOR)
- **Validação**: Bean Validation nos DTOs
- **SQL Injection**: Proteção via JPA/Hibernate
- **XSS**: Sanitização no frontend

---

## 🐛 Troubleshooting

### Docker

**Containers não iniciam**
- ✅ Verifique se Docker está rodando: `docker ps`
- ✅ Verifique logs: `docker-compose logs -f`
- ✅ Portas já em uso: verifique se 5173, 8080, 5433, 11434 estão livres
- ✅ Memória insuficiente: Docker Desktop precisa de pelo menos 6GB RAM alocados

**Frontend retorna ERR_EMPTY_RESPONSE**
- ✅ Limpe cache do browser (Ctrl + F5)
- ✅ Verifique se o container está healthy: `docker ps`
- ✅ Veja logs: `docker logs productengineering-frontend`

**Backend não conecta ao banco**
- ✅ Aguarde o Postgres ficar healthy: `docker-compose ps`
- ✅ Verifique logs: `docker logs productengineering-backend`

**Conflito com PostgreSQL local**
- ✅ O container usa porta 5433 para evitar conflito com instalação local (porta 5432)
- ✅ Se ainda houver conflito, altere no docker-compose.yml

### Assistente IA não responde

**Erro: "Service Unavailable" (503)**

*Docker:*
- ✅ Verifique container: `docker ps | grep ollama`
- ✅ Baixe o modelo: `docker exec productengineering-ollama ollama pull llama3.2:3b`
- ✅ Liste modelos: `docker exec productengineering-ollama ollama list`

*Local:*
- ✅ Verifique se Ollama está rodando: `sc query OllamaService` (Windows)
- ✅ Inicie o serviço: `net start OllamaService`
- ✅ Verifique o modelo: `ollama list` (deve ter llama3.2:3b)

**Erro: "Gateway Timeout" (504)**
- ✅ Modelo pode estar carregando pela primeira vez (espere alguns segundos)
- ✅ Verifique recursos do sistema (RAM/CPU/GPU)
- ✅ Considere usar modelo menor se hardware limitado

**Erro: "User not found"**
- ✅ Certifique-se de estar autenticado
- ✅ Verifique logs do backend para detalhes

### Backend não inicia (Local)

- ✅ Verifique se PostgreSQL está rodando
- ✅ Verifique credenciais em `application.properties`
- ✅ Execute migrations: `mvn flyway:migrate`

### Frontend não compila (Local)

- ✅ Delete `node_modules` e rode `npm install` novamente
- ✅ Limpe cache: `npm cache clean --force`
- ✅ Verifique versão do Node.js: `node --version` (deve ser 18+)

---
