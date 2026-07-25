"use client";

import { ISignupRequest } from "@/interfaces/authentication/signup.interface";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createSignupSchema } from "./signupSchema";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import ErrorText from "../_ui/ErrorText";
import { api } from "@/services";
import { signIn } from "next-auth/react";
import Loading from "../_ui/Loading";
import { getErrorMessage } from "@/types/api";
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
          <label className={authLabelClass} htmlFor="signup-name">
            {t("auth.name")}
          </label>
          <input
            id="signup-name"
            className={authInputClass}
            placeholder={t("auth.namePlaceholder")}
            autoComplete="name"
            {...register("name")}
          />
          <ErrorText>{errors?.name && errors.name.message}</ErrorText>
        </motion.div>

        <motion.div
          className={authFieldWrapClass}
          custom={0.34}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
        >
          <label className={authLabelClass} htmlFor="signup-email">
            {t("auth.email")}
          </label>
          <input
            id="signup-email"
            className={authInputClass}
            placeholder={t("auth.emailPlaceholder")}
            autoComplete="email"
            {...register("email")}
          />
          <ErrorText>{errors?.email && errors.email.message}</ErrorText>
        </motion.div>

        <motion.div
          className={authFieldWrapClass}
          custom={0.4}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
        >
          <label className={authLabelClass} htmlFor="signup-password">
            {t("auth.password")}
          </label>
          <input
            id="signup-password"
            className={authInputClass}
            placeholder={t("auth.passwordPlaceholder")}
            type="password"
            autoComplete="new-password"
            {...register("password")}
          />
          <ErrorText>{errors?.password && errors.password.message}</ErrorText>
        </motion.div>

        <motion.div
          className={authFieldWrapClass}
          custom={0.46}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
        >
          <label className={authLabelClass} htmlFor="signup-confirm">
            {t("auth.confirmPassword")}
          </label>
          <input
            id="signup-confirm"
            className={authInputClass}
            placeholder={t("auth.confirmPasswordPlaceholder")}
            type="password"
            autoComplete="new-password"
            {...register("confirmPassword")}
          />
          <ErrorText>
            {errors?.confirmPassword && errors.confirmPassword.message}
          </ErrorText>
        </motion.div>

        {error && <ErrorText>{error}</ErrorText>}

        <motion.button
          className={authSubmitClass}
          type="submit"
          custom={0.52}
          initial="hidden"
          animate="visible"
          variants={fieldMotion}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
        >
          {t("auth.createAccount")}
        </motion.button>
      </form>
    </section>
  );
};

export default SignupForm;
