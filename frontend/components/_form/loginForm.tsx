"use client";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { yupResolver } from "@hookform/resolvers/yup";
import { IloginRequest } from "@/interfaces/authentication/login.interface";
import { loginSchema } from "./loginSchema";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "../_ui/Loading";
import ErrorText from "../_ui/ErrorText";

const LoginForm = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IloginRequest>({ resolver: yupResolver(loginSchema) });

  const onSubmitHandler = async (data: IloginRequest) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: "/me",
      });
    } catch (err) {
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
        <label className=" text-chatTitle text-lg font-semibold">E-mail:</label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="email"
          {...register("email")}
        />
        <ErrorText>{errors?.email && errors.email.message}</ErrorText>

        <label className=" text-chatTitle text-lg font-semibold">Senha:</label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder="password"
          type="password"
          {...register("password")}
        />
        <ErrorText>{errors?.password && errors.password.message}</ErrorText>
        <button
          type="submit"
          className="button mt-10 mb-2 py-3 bg-chatPrimary rounded text-chatText text-lg hover:shadow-lg"
        >
          Entrar
        </button>
      </form>
    </section>
  );
};

export default LoginForm;
