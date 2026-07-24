# DefaultChat — Frontend

Front-end do **DefaultChat**, projeto de portfólio: chat 1:1 e grupos públicos em tempo real.

Roda junto com a API em [`../backend`](../backend) e um PostgreSQL. Pensado para demo **local** — não é um app de produção sempre online.

## O que a interface cobre

- Landing, signup e login (NextAuth + credentials / JWT da API)
- Área autenticada `/me`
- Busca de usuários e convites de amizade (“Adicionar amizade” / “Convite já enviado”)
- Lista de amigos, pedidos recebidos e empty states com links
- Chat privado 1:1 (`/me/chat/[userId]`)
- Grupos: criar, listar, buscar e entrar (`/me/groups`, chat em `/me/chat/group/[roomId]`)
- Sidebar de membros no grupo + menu de convite
- Avatar com letra e seletor de cor em Configurações
- Socket.io: mensagens em tempo real e status online

## Stack

- Next.js 14 (App Router) + React 18
- NextAuth (Credentials)
- Socket.io client + Axios
- Tailwind CSS, React Hook Form, Yup

## Pré-requisitos

1. API e Postgres rodando (veja [`../backend/README.md`](../backend/README.md) ou Docker na raiz).
2. Node.js 20+ e npm.

Para subir **tudo** de uma vez (front + API + DB), use o Compose na raiz:

```bash
# na raiz do monorepo
docker compose up --build
```

## Instalação local (sem Docker só no front)

```bash
cd frontend
npm install --legacy-peer-deps
cp .env.example .env
```

### Variáveis de ambiente

| Variável | Obrigatória | Exemplo | Descrição |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | sim | `http://localhost:3001` | Base da API no **browser** (HTTP + Socket.io) |
| `API_URL` | recomendada | `http://localhost:3001` | Base da API no **servidor** Next.js (login NextAuth). No Docker Compose: `http://backend:3001` |
| `NEXTAUTH_SECRET` | sim | string aleatória | Segredo da sessão |
| `NEXTAUTH_URL` | sim | `http://localhost:3000` | URL do front |

Exemplo de `.env` local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
API_URL=http://localhost:3001
NEXTAUTH_SECRET=dev-nextauth-secret-change-me
NEXTAUTH_URL=http://localhost:3000
```

> Se `API_URL` estiver errado (comum no Docker apontando para `localhost` de dentro do container), o login via NextAuth falha mesmo com a API ok no host.

### Rodar em desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm run start
```

## Rotas principais da UI

| Rota | Conteúdo |
| --- | --- |
| `/` | Landing |
| `/login`, `/signup` | Autenticação |
| `/me` | Home autenticada |
| `/me/friends` | Amigos e pedidos |
| `/me/requests` | Buscar usuários |
| `/me/groups` | Criar / listar / buscar grupos |
| `/me/chat/[userId]` | Chat 1:1 |
| `/me/chat/group/[roomId]` | Chat de grupo + membros |
| `/me/config` | Cor do avatar |

## Estrutura (resumo)

```
app/                 # App Router (páginas)
components/          # Chat, amigos, grupos, UI
contexts/            # Socket, amigos, busca, pedidos
services/            # Axios + Socket.io client
utils/               # Ex.: cores de avatar
pages/api/auth/      # NextAuth (Credentials)
public/              # Assets estáticos
```

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | Desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servir build |
| `npm run lint` | ESLint |

## API

Backend neste monorepo: [`../backend`](../backend)  
README geral / Docker: [`../README.md`](../README.md)
