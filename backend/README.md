# DefaultChat — API (backend)

API do **DefaultChat**, projeto de portfólio para chat 1:1 e grupos públicos em tempo real.

Front neste monorepo: [`../frontend`](../frontend). Pensada para rodar **localmente** com PostgreSQL — não é um servidor de produção sempre online.

## Stack

- Express + HTTP server
- Socket.io (tempo real)
- TypeORM + PostgreSQL
- JWT (login) + bcrypt
- Multer + AWS S3 (rota de upload antiga; o fluxo atual de avatar usa **cor hex** em `users.image`)

## Funcionalidades

- Contas: signup / login (JWT)
- Usuários: busca, perfil, bloqueio, `PATCH` cor do avatar
- Amigos: convites, aceitar/recusar, listar enviados/recebidos, remover
- Salas privadas 1:1 + histórico
- **Grupos públicos**: criar, listar, buscar, entrar, detalhe (membro)
- Notificações de mensagem não vista
- Status online via Socket.io
- Membership validada ao enviar mensagem no socket

## Pré-requisitos

- Node.js 20+
- PostgreSQL 14+ (ou o serviço `db` do Docker Compose na raiz)

## Instalação local

```bash
cd backend
npm install
cp .env.example .env
```

### Variáveis de ambiente

| Variável | Exemplo | Descrição |
| --- | --- | --- |
| `DB_HOST` | `localhost` | Host do Postgres (`db` no Docker) |
| `DB_USER` | `defaultchat` | Usuário |
| `DB_PASSWORD` | `defaultchat` | Senha |
| `DB` | `defaultchat` | Nome do banco |
| `PGPORT` | `5432` | Porta do Postgres |
| `PORT` | `3001` | Porta HTTP + Socket.io |
| `SECRET_KEY` | string longa | Segredo JWT |
| `TOKEN_EXPIRES_TIME` | `24h` | Expiração do token |
| `CORS_ORIGIN` | `http://localhost:3000` | Origem permitida do front |
| `AWS_ACCESSKEYID` | opcional | Só se usar upload S3 |
| `AWS_SECRETACCESSKEY` | opcional | Só se usar upload S3 |
| `AWS_REGION` | opcional | Região do bucket |
| `AWS_BUCKETNAME` | opcional | Nome do bucket |

Exemplo mínimo de `.env`:

```env
DB_HOST=localhost
DB_USER=defaultchat
DB_PASSWORD=defaultchat
DB=defaultchat
PGPORT=5432
PORT=3001
SECRET_KEY=dev-jwt-secret-change-me
TOKEN_EXPIRES_TIME=24h
CORS_ORIGIN=http://localhost:3000
```

### Migrations e start

`synchronize` do TypeORM está **desligado**. Sempre rode as migrations:

```bash
npm run typeorm migration:run
npm run dev
```

API: http://localhost:3001  

Produção local:

```bash
npm run build
npm start
```

### Com Docker (raiz do monorepo)

```bash
# na raiz
docker compose up --build
```

O entrypoint do backend espera o Postgres saudável, aplica migrations e sobe `node dist/app.js`.

## Rotas HTTP principais

Prefixo `/api`:

### Auth

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Criar conta (avatar cor aleatória) |
| `POST` | `/api/auth/login` | Login (JWT) |

### Usuário

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/user/search` | Buscar usuários |
| `PATCH` | `/api/user/avatar-color` | Atualizar cor do avatar `{ "color": "#33BBB0" }` |
| `GET` | `/api/user/:id` | Dados do usuário |
| `GET` | `/api/user/:id/block` | Bloquear usuário |
| `POST` | `/api/user/img/upload` | Upload de imagem (S3; legado) |

### Amigos

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/friend/` | Listar amigos |
| `GET` | `/api/friend/requests/received` | Pedidos recebidos |
| `GET` | `/api/friend/requests/sent` | Pedidos enviados |
| `POST` | `/api/friend/:userId` | Enviar pedido |
| `POST` | `/api/friend/:requestId/accept` | Aceitar |
| `POST` | `/api/friend/:requestId/decline` | Recusar |
| `DELETE` | `/api/friend/:friendId` | Remover amigo |

### Salas e grupos

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/api/room/list` | Salas ativas (private + group) |
| `GET` | `/api/room/user` | Obter/criar sala privada 1:1 |
| `POST` | `/api/room/group` | Criar grupo público |
| `GET` | `/api/room/group` | Listar grupos (com `isMember`) |
| `GET` | `/api/room/group/search` | Buscar grupos por nome |
| `POST` | `/api/room/group/:roomId/join` | Entrar no grupo |
| `GET` | `/api/room/group/:roomId` | Detalhe (somente membro) |
| `POST` | `/api/room/:roomId/close` | Fechar/desativar sala para o usuário |

### Mensagens e notificações

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/message/:roomId` | Criar mensagem (HTTP) |
| `GET` | `/api/message/:roomId` | Listar mensagens |
| `POST` | `/api/notification/:roomId` | Marcar como vistas |

## Eventos Socket.io

Autenticação: eventos relevantes enviam JWT e o servidor valida (`verifySocketToken`).

**Cliente → servidor**

| Evento | Uso |
| --- | --- |
| `user:register` | Registrar online |
| `user:ready` | Entrar nas salas ativas + lista de amigos online |
| `user:joinRoom` | Entrar em uma room |
| `message:send` | Enviar mensagem (checa membership) |
| `disconnect` | Sair da lista online |

**Servidor → cliente**

| Evento | Uso |
| --- | --- |
| `message:send` | Broadcast na sala |
| `message:openRoom` | Reabrir sala no cliente |
| `friend:isOnline` / `friend:isOffline` | Status |
| `friend:listOnline` | Lista inicial |

## Migrations (TypeORM)

```bash
npm run typeorm migration:run
npm run typeorm migration:revert
```

Ordem atual:

1. `createTables` — users, relationships, rooms, userRooms  
2. `addRoomImage`  
3. `createMessagesTable`  
4. `messageNotificationTable`  
5. `addRoomOnMessageNotification`

## Estrutura (resumo)

```
src/
  app.ts              # Express + HTTP + Socket.io
  data-source.ts      # TypeORM + Postgres
  routes/
  controllers/
  services/
  entities/
  migrations/
  socket/             # Tempo real
  middlewares/
  utils/              # Ex.: paleta de avatar
```

## Scripts

| Script | Uso |
| --- | --- |
| `npm run dev` | ts-node-dev |
| `npm run build` | `tsc` → `dist/` |
| `npm start` | `node dist/app.js` |
| `npm run typeorm` | CLI TypeORM (migrations) |

## Front e Docker

- Front: [`../frontend`](../frontend)  
- Compose / visão geral: [`../README.md`](../README.md)
