# DefaultChatAPI

API do **DefaultChat**, projeto de portfólio para chat 1:1 em tempo real. Pensada para rodar **localmente** com PostgreSQL — não é um servidor de produção sempre online.

Front-end neste monorepo: [`../frontend`](../frontend)

## Stack

- Express
- Socket.io
- TypeORM + PostgreSQL
- JWT (login), bcrypt, Multer + AWS S3 (upload de imagem de perfil)

## Funcionalidades reais

- Contas (signup/login)
- Usuários (busca, perfil, bloqueio, upload de imagem)
- Amigos e pedidos de amizade
- Salas privadas 1:1 e histórico de mensagens
- Notificações de mensagem não vista
- Status online via Socket.io

Não há chat em grupo implementado.

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha:

| Variável | Descrição |
| --- | --- |
| `DB_HOST` | Host do PostgreSQL |
| `DB_USER` | Usuário do banco |
| `DB_PASSWORD` | Senha do banco |
| `DB` | Nome do banco |
| `PGPORT` | Porta do Postgres (padrão `5432`) |
| `PORT` | Porta HTTP/Socket da API |
| `SECRET_KEY` | Segredo para JWT |
| `TOKEN_EXPIRES_TIME` | Expiração do token |
| `CORS_ORIGIN` | Origem permitida (front) |
| `AWS_ACCESSKEYID` | Credencial AWS (upload) |
| `AWS_SECRETACCESSKEY` | Credencial AWS (upload) |
| `AWS_REGION` | Região do bucket |
| `AWS_BUCKETNAME` | Nome do bucket S3 |

## Como rodar

```bash
npm install
cp .env.example .env
# configure o .env e garanta que o PostgreSQL está acessível
npm run typeorm migration:run
npm run dev
```

## Rotas HTTP principais

Prefixo `/api`:

| Método | Rota | Descrição |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Criar conta |
| `POST` | `/api/auth/login` | Login (JWT) |
| `GET` | `/api/user/search` | Buscar usuários |
| `GET` | `/api/user/:id` | Dados do usuário |
| `GET` | `/api/user/:id/block` | Bloquear usuário |
| `POST` | `/api/user/img/upload` | Upload de imagem de perfil |
| `GET` | `/api/friend/` | Listar amigos |
| `GET` | `/api/friend/requests/received` | Pedidos recebidos |
| `GET` | `/api/friend/requests/sent` | Pedidos enviados |
| `POST` | `/api/friend/:userId` | Enviar pedido de amizade |
| `POST` | `/api/friend/:requestId/accept` | Aceitar pedido |
| `POST` | `/api/friend/:requestId/decline` | Recusar pedido |
| `DELETE` | `/api/friend/:friendId` | Remover amigo |
| `GET` | `/api/room/list` | Listar salas ativas |
| `GET` | `/api/room/user` | Obter/criar sala privada 1:1 |
| `POST` | `/api/room/:roomId/close` | Fechar chat (desativar sala para o usuário) |
| `POST` | `/api/message/:roomId` | Criar mensagem (HTTP) |
| `GET` | `/api/message/:roomId` | Listar mensagens da sala |
| `POST` | `/api/notification/:roomId` | Marcar mensagens da sala como vistas |

## Eventos Socket.io

**Cliente → servidor**

| Evento | Uso |
| --- | --- |
| `user:register` | Registrar `userId` na lista de online |
| `user:ready` | Entrar nas salas ativas e sincronizar amigos online |
| `user:joinRoom` | Entrar em uma sala |
| `message:send` | Enviar mensagem em tempo real |
| `disconnect` | Remoção da lista online e aviso aos amigos |

**Servidor → cliente**

| Evento | Uso |
| --- | --- |
| `message:send` | Broadcast da mensagem na sala |
| `message:openRoom` | Reabrir sala no cliente quando chega mensagem |
| `friend:isOnline` | Amigo entrou online |
| `friend:isOffline` | Amigo saiu |
| `friend:listOnline` | Lista inicial de amigos online |

## Migrations (TypeORM)

`synchronize` está desligado. Use as migrations em `src/migrations/`:

```bash
npm run typeorm migration:run
npm run typeorm migration:revert
```

Migrations existentes (ordem):

1. `createTables` — usuários, relacionamentos, salas
2. `addRoomImage` — imagem na sala
3. `createMessagesTable` — mensagens
4. `messageNotificationTable` — notificações de mensagem
5. `addRoomOnMessageNotification` — vínculo sala ↔ notificação

## Estrutura (resumo)

```
src/
  app.ts              # Express + HTTP server + Socket.io
  data-source.ts      # TypeORM + Postgres
  routes/             # Rotas HTTP
  controllers/
  services/
  entities/
  migrations/
  socket/             # Eventos e serviços em tempo real
  middlewares/
```
