import * as yup from "yup";
import type { TFunction } from "i18next";

export const createSignupSchema = (t: TFunction) =>
  yup.object().shape({
    name: yup
      .string()
      .min(4, t("auth.minChars", { count: 4 }))
      .max(32, t("auth.maxChars", { count: 32 }))
      .required(t("auth.required")),
    email: yup
      .string()
      .email(t("auth.invalidEmail"))
      .required(t("auth.required")),
    password: yup
      .string()
      .min(6, t("auth.minChars", { count: 6 }))
      .max(32, t("auth.maxChars", { count: 32 }))
      .required(t("auth.required")),
    confirmPassword: yup
      .string()
      .min(6, t("auth.minChars", { count: 6 }))
      .max(32, t("auth.maxChars", { count: 32 }))
      .required(t("auth.required"))
      .test("passwords-match", t("auth.passwordsMustMatch"), function (value) {
        return this.parent.password === value;
      }),
  });
