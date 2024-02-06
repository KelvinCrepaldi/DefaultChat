import { ILike } from 'typeorm';
import AppDataSource from '../../data-source';
import { User } from '../../entities/user.entity';

const searchUserService = async ({ letters, userId }: { letters: string; userId: string }) => {
   const userRepository = AppDataSource.getRepository(User);

   const users = userRepository.find({
      where: { name: ILike(`%${letters}%`) }
   });

   return users;
};

export default searchUserService;
