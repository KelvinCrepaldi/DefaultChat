import AppDataSource from '../../data-source';
import { User } from '../../entities/user.entity';
import { AppError } from '../../errors/appErrors';
import { IloginRequest } from '../../interface/authentication/login.interface';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { IUserAuthResponse } from '../../interface/authentication/userAuth.interface';

const loginService = async ({ email, password }: IloginRequest): Promise<IUserAuthResponse> => {
   const userRepository = AppDataSource.getRepository(User);

   const user = await userRepository.findOne({
      where: { email }
   });

   if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
   }

   const passwordMatch = await bcrypt.compare(password, user.password);

   if (!passwordMatch) {
      throw new AppError(401, 'Senha incorreta');
   }

   const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
      expiresIn: process.env.TOKEN_EXPIRES_TIME
   });

   return {
      token,
      user: { id: user.id, name: user.name, email: user.email, image: user.image }
   };
};

export default loginService;
