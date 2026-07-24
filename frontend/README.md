# DefaultChat

Projeto de portfólio: front-end de um chat 1:1 em tempo real. Demo pensada para rodar **localmente** junto com a API e um PostgreSQL — não é um serviço de produção sempre online.

## O que faz

- Contas e login (NextAuth no front)
- Busca de usuários, amigos e pedidos de amizade
- Salas privadas 1:1
- Mensagens em tempo real com Socket.io
- Status online de amigos conectados

## Stack

- **Next.js** (App Router) + React
- **NextAuth** para sessão no front
- Cliente **Socket.io**
- Consome a API em [`../backend`](../backend) (Express + TypeORM + PostgreSQL)

## Como rodar

1. Suba a API e o PostgreSQL (veja [`../backend/README.md`](../backend/README.md)).
2. Neste diretório (`frontend/`):

```bash
npm install
cp .env.example .env
```

3. Preencha o `.env` com base em `.env.example`:

| Variável | Descrição |
| --- | --- |
| `NEXT_PUBLIC_API_URL` | URL da API (ex.: `http://localhost:3001`) |
| `NEXTAUTH_SECRET` | Segredo usado pelo NextAuth |
| `NEXTAUTH_URL` | URL do front (ex.: `http://localhost:3000`) |

4. Inicie o front:

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

## Estrutura (resumo)

```
app/            # Rotas (home, login, signup, área /me)
components/     # UI do chat, amigos, formulários
contexts/       # Estado compartilhado (ex.: socket)
services/       # Chamadas HTTP à API
hooks/          # Hooks auxiliares
public/         # Assets estáticos
```

## API neste monorepo

Backend: [`../backend`](../backend)
