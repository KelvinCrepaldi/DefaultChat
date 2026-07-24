import Image from "next/image";
import { CgArrowBottomRight } from "react-icons/cg";
export default function Me() {
  return <main className="text-chatText m-10 overflow-y-auto h-[90vh] ">

    <Image alt="Default chat logo" src={"/defaultchatLogo.svg"} width={200} height={200}></Image>
    
    <h1 className="my-10 text-2xl text-chatTitle">Bem-vindo ao DefaultChat</h1>

    <div className="gap-5 flex flex-col max-w-[800px]">
      <p>
      O DefaultChat é um projeto de portfólio para praticar chat em tempo real.
      Inclui contas, amigos, pedidos de amizade, salas privadas 1:1, status
      online e mensagens via Socket.io.
      </p>

      <p>
      O front usa Next.js com NextAuth; a API é Express com TypeORM e
      PostgreSQL. Rode localmente com a API e um banco Postgres — não é um
      serviço de produção sempre online.
      </p>
    </div>
  
    <ul className="flex flex-col gap-5 mt-10 mb-24">
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
          Contas e sessão:
          </strong>
          <p>Crie uma conta, faça login e use a área autenticada do app.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Amigos e pedidos:
          </strong> 
          <p>Busque usuários, envie pedidos de amizade e gerencie a lista de amigos.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Chat 1:1 em tempo real:
          </strong> 
          <p>Abra salas privadas e converse via Socket.io com status online dos amigos conectados.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Rodar localmente:
          </strong> 
          <p>O fluxo completo depende da API DefaultChatAPI e de um PostgreSQL local.</p>
        </li>
    </ul>

  </main>;
}
