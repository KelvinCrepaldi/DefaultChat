# DefaultChat

Projeto de **portfólio**: chat em tempo real (1:1 e grupos públicos) em um monorepo com front e API. Feito para rodar **localmente** (Docker ou Node + Postgres) — não é um serviço de produção sempre online.

```
DefaultChat/
├── frontend/     # Next.js + NextAuth + Socket.io client
├── backend/      # Express + Socket.io + TypeORM + PostgreSQL
└── docker-compose.yml
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
| Frontend | Next.js 14 (App Router), React, NextAuth, Socket.io client, Tailwind |
| Backend | Express, Socket.io, TypeORM, PostgreSQL, JWT, bcrypt |
| Infra local | Docker Compose (Postgres + API + front) |

---

## Opção A — Docker (recomendado)

### Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (ou Docker Engine + Compose v2)
- Portas livres: **3000** (front) e **3001** (API)

### Subir tudo

Na **raiz** do repositório:

```bash
docker compose up --build
```

Na primeira vez o build pode demorar alguns minutos. O Compose sobe:

1. **Postgres** (`db`) — healthcheck antes da API
2. **Backend** — roda migrations e inicia em `:3001`
3. **Frontend** — Next.js em produção em `:3000`

### URLs

| Serviço | URL |
| --- | --- |
| Front | http://localhost:3000 |
| API | http://localhost:3001 |

### Comandos úteis

```bash
# logs
docker compose logs -f

# só o front / só a API
docker compose logs -f frontend
docker compose logs -f backend

# parar (mantém volume do Postgres)
docker compose down

# parar e apagar o banco local do Compose
docker compose down -v
```

### Variáveis no Docker

Já vêm definidas no `docker-compose.yml` para demo:

- Front no browser fala com a API em `http://localhost:3001`
- NextAuth (servidor, dentro do container) usa `API_URL=http://backend:3001`
- Postgres interno: usuário/senha/db `defaultchat`

Upload S3 / AWS não é necessário para o fluxo principal (chat, amigos, grupos, avatar por cor).

### Fluxo rápido para testar

1. Abra http://localhost:3000 → criar conta
2. Em outra sessão/navegador, crie um segundo usuário
3. **Buscar usuários** → adicionar amizade → aceitar em **Amigos**
4. Abra o chat 1:1 ou vá em **Grupos** → criar / entrar → conversar

---

## Opção B — Sem Docker (Node + Postgres local)

### Requisitos

- **Node.js** 20+ (recomendado) e npm
- **PostgreSQL** 14+ rodando e acessível
- Portas **3000** e **3001** (ou ajuste nos `.env`)

### 1. Banco de dados

Crie um database e um usuário, por exemplo:

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

Edite `backend/.env` (mínimo):

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

AWS (`AWS_*`) pode ficar vazio/placeholder se você não for usar upload de imagem antigo.

Rode migrations e a API:

```bash
npm run typeorm migration:run
npm run dev
```

Confirme: http://localhost:3001 deve responder algo como “Default chat app!”.

Detalhes e rotas: [`backend/README.md`](backend/README.md).

### 3. Frontend

Em **outro terminal**:

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
```

Edite `frontend/.env`:

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | API no browser e Socket.io |
| `API_URL` | `http://localhost:3001` | API no servidor Next.js (NextAuth). Em Docker usa `http://backend:3001` |
| `NEXTAUTH_SECRET` | `outro-segredo-longo` | Segredo da sessão NextAuth |
| `NEXTAUTH_URL` | `http://localhost:3000` | URL pública do front |

```bash
npm run dev
```

Abra http://localhost:3000.

Detalhes da UI: [`frontend/README.md`](frontend/README.md).

---

## Documentação por pasta

| Pasta | README |
| --- | --- |
| API | [`backend/README.md`](backend/README.md) |
| Front | [`frontend/README.md`](frontend/README.md) |

## Observações

- Demo de portfólio: estado online em memória no processo da API (não escala multi-instância).
- Avatar: a coluna `users.image` guarda a **cor hex** do avatar (letra + fundo).
- Se o login falhar só no Docker, confira se `API_URL` aponta para o hostname do serviço backend na rede Compose.
