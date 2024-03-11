import HeaderSection from "@/components/_ui/HeaderSection";
import ImageUploader from "@/components/imageUploader";

export default function Config() {
  return (
    <>
      <section>
        <HeaderSection text="Configurações" />
        <h1 className="text-center p-5 text-3xl text-yellow-200">
          Em construção
        </h1>

        <ImageUploader/>
      </section>
    </>
  );
}
