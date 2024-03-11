import Image from "next/image";

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
      Criado com a finalidade de explorar e aprender os fundamentos da troca de 
      informações através de APIs e Sockets, o DefaultChat se destaca por 
      proporcionar conversas privadas seguras. Seja para trocar mensagens 
      pessoais, discutir tópicos sensíveis ou simplesmente manter uma 
      comunicação discreta, nossa plataforma intuitiva está aqui para tornar 
      suas conversas online diretas e eficientes.
      </p>
      <section className="flex my-20 space-x-4">
        <HighlightTech 
            imageSrc="./nextSVG.svg" 
            text="  DefaultChat é ágil e responsivo graças ao Next.js, garantindo uma
            experiência web envolvente. Mensagens em tempo real, com estilo."
        />
        <HighlightTech 
            imageSrc="./ExpressSVG.svg" 
            text=" Usamos Express API para eficiência na comunicação. Seguro e rápido,
            o DefaultChat oferece uma experiência de troca de mensagens
            simplificada."
        />
        <HighlightTech 
            imageSrc="./socketSVG.svg" 
            text=" DefaultChat proporciona interação instantânea com a tecnologia de
            sockets. Conversas em tempo real, sem atrasos, para uma comunicação
            fluida."
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
