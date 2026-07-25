import * as yup from "yup";
import type { TFunction } from "i18next";

export const createLoginSchema = (t: TFunction) =>
  yup.object().shape({
    email: yup
      .string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.required")),
    password: yup
      .string()
      .min(6, t("auth.minChars", { count: 6 }))
      .max(32, t("auth.maxChars", { count: 32 }))
      .required(t("auth.required")),
  });
