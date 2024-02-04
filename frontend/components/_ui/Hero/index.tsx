const Hero = () => {
  return (
    <section className="w-full flex flex-col items-center p-5">
      <h1 className="text-chatTitle text-7xl">DefaultChat</h1>
      <p className="text-chatText text-xl text-center mt-3">
        Conecte-se com confiança, converse com facilidade!
      </p>
      <div className="w-full max-w-[600px] mx-5 h-[2px] bg-chatTitle mt-5"></div>
    </section>
  );
};

export default Hero;
