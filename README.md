# DefaultChat

Projeto de **portfólio**: chat em tempo real (1:1 e grupos públicos) em um monorepo com front e API. Feito para rodar **localmente** — não é um serviço de produção sempre online.

```
DefaultChat/
├── frontend/          # Next.js + NextAuth + Socket.io (pnpm)
├── backend/           # Express + Socket.io + TypeORM + PostgreSQL
└── docker-compose.yml # Postgres + API (o front NÃO entra no Compose)
```

## O que o projeto faz

- Contas (signup / login com JWT + sessão NextAuth)
- Busca de usuários e pedidos de amizade (enviar, aceitar, recusar, remover)
- Chat privado 1:1 em tempo real
- **Grupos públicos**: criar, listar, buscar e entrar
- Sidebar de membros no chat de grupo + convite de amizade
- Status online de amigos conectados (Socket.io)
- Avatar com letra e cor escolhível (sem upload obrigatório)
- Empty states, loadings e feedback de “convite já enviado”

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js 14 (App Router), React, NextAuth, Socket.io client, Tailwind, pnpm |
| Backend | Express, Socket.io, TypeORM, PostgreSQL, JWT, bcrypt |
| Infra local | Docker Compose (**só** Postgres + API) |

---

## Como rodar (recomendado)

Fluxo atual: **Docker sobe API + Postgres**; o **front roda na máquina** com pnpm.

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose v2)
- Node.js **20+** e [pnpm](https://pnpm.io/)
- Portas livres: **3001** (API) e **3000** (front)

### 1. API e banco (Docker)

Na **raiz** do repositório:

```bash
docker compose up --build
```

Na primeira vez o build pode demorar alguns minutos. O Compose sobe:

1. **Postgres** (`db`) — healthcheck antes da API  
2. **Backend** — migrations e API em `:3001`

O frontend **não** faz parte do Compose.

Variáveis de demo já vêm no `docker-compose.yml` (Postgres `defaultchat` / `defaultchat`, CORS para `http://localhost:3000`).

Comandos úteis:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose down      # mantém o volume do Postgres
docker compose down -v   # apaga o banco local do Compose
```

### 2. Frontend (local, pnpm)

Em **outro terminal**:

```bash
cd frontend
pnpm install
cp .env.example .env
```

Edite `frontend/.env` se precisar:

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | API no browser e Socket.io |
| `API_URL` | `http://localhost:3001` | API no servidor Next.js (NextAuth) |
| `NEXTAUTH_SECRET` | `outro-segredo-longo` | Segredo da sessão NextAuth |
| `NEXTAUTH_URL` | `http://localhost:3000` | URL pública do front |

```bash
pnpm run dev
```

### URLs

| Serviço | URL |
| --- | --- |
| Front | http://localhost:3000 |
| API | http://localhost:3001 |

### Fluxo rápido para testar

1. Compose no ar + front em http://localhost:3000 → criar conta  
2. Em outra sessão/navegador, crie um segundo usuário  
3. **Buscar usuários** → pedido de amizade → aceitar em **Amigos**  
4. Chat 1:1 ou **Grupos** → criar / entrar → conversar  

---

## Alternativa — sem Docker (Node + Postgres local)

### Requisitos

- Node.js 20+ (npm no back, pnpm no front)
- PostgreSQL 14+ acessível
- Portas **3000** e **3001**

### 1. Banco

```sql
CREATE USER defaultchat WITH PASSWORD 'defaultchat';
CREATE DATABASE defaultchat OWNER defaultchat;
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Mínimo no `backend/.env`:

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `DB_HOST` | `localhost` | Host do Postgres |
| `DB_USER` | `defaultchat` | Usuário |
| `DB_PASSWORD` | `defaultchat` | Senha |
| `DB` | `defaultchat` | Nome do banco |
| `PGPORT` | `5432` | Porta do Postgres |
| `PORT` | `3001` | Porta da API / Socket.io |
| `SECRET_KEY` | `qualquer-segredo-longo` | Assinatura JWT |
| `TOKEN_EXPIRES_TIME` | `24h` | Expiração do token |
| `CORS_ORIGIN` | `http://localhost:3000` | Origem do front |

AWS (`AWS_*`) pode ficar vazio se você não usar upload S3 (avatar atual usa cor hex).

```bash
npm run typeorm migration:run
npm run dev
```

Confirme: http://localhost:3001 deve responder algo como “Default chat app!”.

Detalhes: [`backend/README.md`](backend/README.md).

### 3. Frontend

```bash
cd frontend
pnpm install
cp .env.example .env
pnpm run dev
```

Mesmas variáveis da seção recomendada. Detalhes: [`frontend/README.md`](frontend/README.md).

---

## Documentação por pasta

| Pasta | README |
| --- | --- |
| API | [`backend/README.md`](backend/README.md) |
| Front | [`frontend/README.md`](frontend/README.md) |

## Observações

- Demo de portfólio: estado online em memória no processo da API (não escala multi-instância).
- Avatar: a coluna `users.image` guarda a **cor hex** do avatar (letra + fundo).
- Upload S3 / AWS não é necessário para o fluxo principal (chat, amigos, grupos, avatar por cor).
