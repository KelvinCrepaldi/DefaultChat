const About = () => {
  return (
    <section className="section">
      <h1 className="homeTitle">O que é o DefaultChat?</h1>
      <p className="homeText">
        O DefaultChat é um projeto de portfólio concebido para oferecer uma
        experiência de texto genérica e descomplicada, incorporando funções
        básicas.
      </p>
      <p className="homeText">
        Criado com a finalidade de explorar e aprender os fundamentos da troca
        de informações através de APIs e Sockets, o DefaultChat se destaca por
        proporcionar conversas privadas seguras e facilitar a comunicação em
        grupos. Seja para trocar mensagens pessoais ou coordenar com equipes,
        nossa plataforma intuitiva está aqui para tornar suas conversas online
        diretas e eficientes.
      </p>

      <section className="flex my-20 space-x-4">
        <div className="bg-chatBackground1 border border-chatBorder rounded p-4">
          <p className="text-chatTitle">
            DefaultChat é ágil e responsivo graças ao Next.js, garantindo uma
            experiência web envolvente. Mensagens em tempo real, com estilo.
          </p>
        </div>
        <div className="bg-chatBackground1 border border-chatBorder rounded p-4">
          <p className="text-chatTitle">
            Usamos Express API para eficiência na comunicação. Seguro e rápido,
            o DefaultChat oferece uma experiência de troca de mensagens
            simplificada.
          </p>
        </div>
        <div className="bg-chatBackground1 border border-chatBorder rounded p-4">
          <p className="text-chatTitle">
            DefaultChat proporciona interação instantânea com a tecnologia de
            sockets. Conversas em tempo real, sem atrasos, para uma comunicação
            fluida.
          </p>
        </div>
      </section>
    </section>
  );
};

export default About;
