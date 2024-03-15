import Image from "next/image";
import { FaHandPointRight } from "react-icons/fa6";
import { CgArrowBottomRight } from "react-icons/cg";
export default function Me() {
  return <main className="text-chatText m-10 overflow-y-auto h-[90vh] ">

    <Image alt="Default chat logo" src={"/defaultchatLogo.svg"} width={200} height={200}></Image>
    
    <h1 className="my-10 text-2xl text-chatTitle">Bem vindo a versão 1.0 do Default Chat</h1>

    <div className="gap-5 flex flex-col max-w-[800px]">
      <p>
      O DefaultChat é um projeto de portfólio concebido para oferecer uma 
      experiência de texto genérica e descomplicada, incorporando funções 
      básicas.
      </p>

      <p>
      Criado com a finalidade de explorar e aprender os fundamentos da troca de 
      informações através de APIs e Sockets, o DefaultChat se destaca por 
      proporcionar conversas privadas seguras. Seja para trocar mensagens 
      pessoais, discutir tópicos sensíveis ou simplesmente manter uma comunicação 
      discreta, nossa plataforma intuitiva está aqui para tornar suas conversas 
      online diretas e eficientes.
      </p>
    </div>
  
    <ul className="flex flex-col gap-5 mt-10 mb-24">
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
          Adicionar Amigos Rapidamente:
          </strong>
          <p>Conecte-se com amigos adicionando contatos de forma simples e rápida.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Buscar Usuários:
          </strong> 
          <p>Encontre facilmente amigos ou novos contatos através da função de busca integrada.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Configurações Personalizadas:
          </strong> 
          <p>Ajuste o aplicativo de acordo com suas preferências com opções de configuração simples e intuitivas.</p>
        </li>
        <li>
          <strong className="text-chatTextWhite flex">
            <span className="text-chatTitle"><CgArrowBottomRight /></span>
            Iniciar Conversas:
          </strong> 
          <p>Comece conversas instantaneamente com amigos e contatos recém-adicionados.</p>
        </li>
    </ul>

  </main>;
}
