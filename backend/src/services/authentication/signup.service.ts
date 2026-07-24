import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import {
  ISignupRequest,
  ISignupResponse,
} from "../../interface/authentication/signup.interface";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pickRandomAvatarColor } from "../../utils/avatarColors";

const signupService = async ({
  name,
  email,
  password,
}: ISignupRequest): Promise<ISignupResponse> => {
  const userRepository = AppDataSource.getRepository(User);

  const findUser = await userRepository.findOne({ where: { email: email } });

  if (findUser) {
    throw new AppError(
      409,
      "O usuário com o e-mail fornecido já existe em nosso sistema."
    );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User();

  user.email = email;
  user.name = name;
  user.password = hashedPassword;
  user.image = pickRandomAvatarColor();
  await userRepository.save(user);

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
    expiresIn: process.env.TOKEN_EXPIRES_TIME,
  });

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
    },
  };
};

export default signupService;
