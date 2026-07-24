# DefaultChat

Projeto de portfólio: chat 1:1 em tempo real (front + API) em um único repositório. Demo pensada para rodar **localmente** com PostgreSQL — não é um serviço de produção sempre online.

Monorepo com o histórico do front e da API reunidos em um só projeto.

## Estrutura

```
frontend/   # Next.js + NextAuth + Socket.io client
backend/    # Express + Socket.io + TypeORM + PostgreSQL
```

## O que faz

- Contas e login
- Busca de usuários, amigos e pedidos de amizade
- Salas privadas 1:1
- Grupos públicos (criar, buscar e entrar)
- Mensagens em tempo real (Socket.io)
- Status online de amigos conectados

## Stack

| Camada | Tecnologias |
| --- | --- |
| Frontend | Next.js (App Router), React, NextAuth, Socket.io client |
| Backend | Express, Socket.io, TypeORM, PostgreSQL, JWT, bcrypt |

## Como rodar

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Preencha o `.env` (Postgres, `SECRET_KEY`, `CORS_ORIGIN`, etc.). Veja detalhes em [`backend/README.md`](backend/README.md).

Rode as migrations e inicie a API:

```bash
npm run typeorm migration:run
npm run dev
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

| Variável | Exemplo |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` |
| `NEXTAUTH_SECRET` | segredo local |
| `NEXTAUTH_URL` | `http://localhost:3000` |

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).
