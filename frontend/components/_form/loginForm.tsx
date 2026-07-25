"use client";

import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { IloginRequest } from "@/interfaces/authentication/login.interface";
import { createLoginSchema } from "./loginSchema";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Loading from "../_ui/Loading";
import ErrorText from "../_ui/ErrorText";
import { useTranslation } from "react-i18next";
import {
  authFieldWrapClass,
  authInputClass,
  authLabelClass,
  authSubmitClass,
} from "./authFieldStyles";

const fieldMotion = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      delay,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

const LoginForm = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const loginSchema = useMemo(() => createLoginSchema(t), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IloginRequest>({ resolver: yupResolver(loginSchema) });

  const onSubmitHandler = async (data: IloginRequest) => {
    try {
      setLoading(true);
      setErrorMessage(null);
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result && result.ok) router.push("/me");
      if (result && result.error) {
        setErrorMessage(t("auth.invalidUser"));
      }
      console.log(result);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <section className="flex w-full flex-col">
      <form
        className="flex flex-col gap-5"
        onSubmit={handleSubmit(onSubmitHandler)}
      >
        <motion.div
          className={authFieldWrapClass}
          custom={0.28}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
        >
          <label className={authLabelClass} htmlFor="login-email">
            {t("auth.email")}
          </label>
          <input
            id="login-email"
            className={authInputClass}
            placeholder={t("auth.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
          />
          <ErrorText>{errors?.email && errors.email.message}</ErrorText>
        </motion.div>

        <motion.div
          className={authFieldWrapClass}
          custom={0.36}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
        >
          <label className={authLabelClass} htmlFor="login-password">
            {t("auth.password")}
          </label>
          <input
            id="login-password"
            className={authInputClass}
            placeholder={t("auth.passwordPlaceholder")}
            type="password"
            autoComplete="current-password"
            {...register("password")}
          />
          <ErrorText>{errors?.password && errors.password.message}</ErrorText>
        </motion.div>

        {errorMessage && (
          <div className="flex justify-center">
            <ErrorText>{errorMessage}</ErrorText>
          </div>
        )}

        <motion.button
          type="submit"
          className={authSubmitClass}
          custom={0.44}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("auth.enter")}
        </motion.button>
      </form>
    </section>
  );
};

export default LoginForm;
