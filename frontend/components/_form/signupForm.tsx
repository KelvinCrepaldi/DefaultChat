"use client";

import { ISignupRequest } from "@/interfaces/authentication/signup.interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSignupSchema } from "./signupSchema";
import { useMemo, useState } from "react";
import ErrorText from "../_ui/ErrorText";
import { api } from "@/services";
import { signIn } from "next-auth/react";
import Loading from "../_ui/Loading";
import { getErrorMessage } from "@/types/api";
import { useTranslation } from "react-i18next";

const SignupForm = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>();
  const [error, setError] = useState<string | null>(null);
  const signupSchema = useMemo(() => createSignupSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupRequest>({ resolver: yupResolver(signupSchema) });

  const onSubmitHandler = async (data: ISignupRequest) => {
    try {
      setLoading(true);
      const response = await api.post("/api/auth/signup", data);
      console.log(response);
      if (response.status === 200) {
        await signIn("credentials", {
          email: data.email,
          password: data.password,
          redirect: true,
          callbackUrl: "/me",
        });
      }
    } catch (err: unknown) {
      console.log(err);
      setError(getErrorMessage(err, t("auth.signupError")));
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
        <label className=" text-chatTitle text-lg font-semibold">
          {t("auth.name")}
        </label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder={t("auth.namePlaceholder")}
          {...register("name")}
        />
        <ErrorText>{errors?.name && errors.name.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">
          {t("auth.email")}
        </label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder={t("auth.emailPlaceholder")}
          {...register("email")}
        />
        <ErrorText> {errors?.email && errors.email.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">
          {t("auth.password")}
        </label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder={t("auth.passwordPlaceholder")}
          type="password"
          {...register("password")}
        />
        <ErrorText>{errors?.password && errors.password.message}</ErrorText>
        <label className=" text-chatTitle text-lg font-semibold">
          {t("auth.confirmPassword")}
        </label>
        <input
          className="text-chatBackground p-1 rounded"
          placeholder={t("auth.confirmPasswordPlaceholder")}
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
          {t("auth.createAccount")}
        </button>
      </form>
    </section>
  );
};

export default SignupForm;
