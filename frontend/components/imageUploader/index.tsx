'use client'
import React, { useEffect, useState } from 'react';
import { api } from '@/services';
import Image from 'next/image';
import { signOut, useSession } from 'next-auth/react';


const ImageUploader = () => {
  const {data: session, update} = useSession();
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 1024 * 1024) { // Verifica se o tamanho do arquivo é superior a 1 MB
      setErrorMessage('O tamanho da imagem excede 1 MB.');
      return;
    }
    setSelectedFile(event.target.files[0]);
    setPreviewImage(URL.createObjectURL(event.target.files[0]));
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      setErrorMessage("Por favor, selecione um arquivo.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await api.post('api/user/img/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${session?.user.accessToken}`
        }
      });
      const data = response.data;
      signOut({ callbackUrl: "/login" });
    } catch (error) {
      console.error('Erro ao enviar imagem:', error);
      setErrorMessage("Erro ao enviar imagem. Por favor, tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    if(session?.user.accessToken)
    setPreviewImage(session.user.picture)
  },[session])

  return (
    <div className=' flex flex-col items-center gap-5 max-w-[500px] p-10'>
      <h1 className='text-3xl text-chatTitle'>Alterar imagem de perfil</h1>
      <div> 
        {previewImage && <img
          src={previewImage}
          className="rounded-full w-[50px] h-[50px] object-cover bg-black"
          width={55}
          height={55}
          alt="Previwe profile image"
        ></img>}
      </div>

      <div className='max-w-[250px] w-full gap-1 flex flex-col'>
        <input type="file" onChange={handleFileChange} id="custom-input" hidden
        />
        <label htmlFor="custom-input"
        className='button'
        >Escolher imagem</label>
      
      
        <button onClick={handleSubmit} disabled={isLoading} className='button'> 
          {isLoading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
      
      <p className='text-center text-chatTextWhite'>Necessario fazer login novamente ao atualizar a imagem.</p>
      {errorMessage && <p className='text-center text-red-500'>{errorMessage}</p>}
    </div>
  );
};

export default ImageUploader;