import Image from "next/image";

const About = () => {
  return (
    <section className="section">
      <h1 className="homeTitle">O que é o DefaultChat?</h1>
      <p className="homeText">
        O DefaultChat é um projeto de portfólio feito para praticar chat em
        tempo real. Inclui contas, amigos, pedidos de amizade, salas privadas
        1:1, status online e mensagens via Socket.io.
      </p>
      <p className="homeText">
        O front usa Next.js com NextAuth; a API é Express com TypeORM e
        PostgreSQL. Foi pensado para rodar localmente com a API e um banco
        Postgres — não é um serviço de produção sempre online.
      </p>
      <section className="flex my-20 space-x-4">
        <HighlightTech 
            imageSrc="./nextSVG.svg" 
            text=" Front em Next.js com App Router e NextAuth para sessão de
            usuários na interface do chat."
        />
        <HighlightTech 
            imageSrc="./ExpressSVG.svg" 
            text=" API em Express com TypeORM e PostgreSQL: contas, amigos,
            salas privadas e histórico de mensagens."
        />
        <HighlightTech 
            imageSrc="./socketSVG.svg" 
            text=" Socket.io para chat 1:1 em tempo real e atualização de
            status online entre amigos conectados."
        />
      </section>
    </section>
  );
};

const HighlightTech = ({imageSrc, text}: {imageSrc: string, text: string}) =>{
  return (
    <div className="flex flex-col items-center p-4">
      <Image src={imageSrc} width={100} height={100} alt="Next logo"></Image>
      <p className="text-chatTitle pt-3 text-center">
        {text}
      </p>
    </div>
  )
}

export default About;
