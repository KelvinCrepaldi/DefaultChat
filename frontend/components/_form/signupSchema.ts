import * as yup from "yup";

export const signupSchema = yup.object().shape({
  name: yup.string().min(4).max(32).required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).max(32).required(),
  confirmPassword: yup
    .string()
    .min(6)
    .max(32)
    .required()
    .test("passwords-match", "Passwords must match", function (value) {
      return this.parent.password === value;
    }),
});
