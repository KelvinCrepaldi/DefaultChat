"use client";

import { ISignupRequest } from "@/interfaces/authentication/signup.interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "./signupSchema";
import { useState } from "react";
import ErrorText from "../_ui/ErrorText";
import { api } from "@/services";
import { signIn } from "next-auth/react";
import Loading from "../_ui/Loading";

const SignupForm = () => {
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignupRequest>({ resolver: yupResolver(signupSchema) });

  const onSubmitHandler = async (data: ISignupRequest) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", data);
      console.log(response);
      if (response.status === 200) {
        const result = await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: "/me",
        });
      }
    } catch (err: any) {
      console.log(err);
      setError(err.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="flex flex-col w-full max-w-[400px]">
      <form className="flex flex-col" onSubmit={handleSubmit(onSubmitHandler)}>
        <label className=" text-chatTitle text-lg font-semibold">Nome:</label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="nome"
          {...register("name")}
        />
        <ErrorText>{errors?.name && errors.name.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">E-mail:</label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="email"
          {...register("email")}
        />
        <ErrorText> {errors?.email && errors.email.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">Senha:</label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="password"
          type="password"
          {...register("password")}
        />
        <ErrorText>{errors?.password && errors.password.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">
          Confirmar senha:
        </label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="confirmar password"
          type="password"
          {...register("confirmPassword")}
        />
        <ErrorText>
          {errors?.confirmPassword && errors.confirmPassword.message}
        </ErrorText>
        {error && <ErrorText>{error}</ErrorText>}
        <button
          className="button mt-10 mb-2 py-3 bg-chatPrimary rounded text-chatText text-lg hover:shadow-lg"
          type="submit"
        >
          Criar conta
        </button>
      </form>
    </section>
  );
};

export default SignupForm;
