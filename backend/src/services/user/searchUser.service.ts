import { ILike } from 'typeorm';
import AppDataSource from '../../data-source';
import { User } from '../../entities/user.entity';
import { ISearchUserRequest } from '../../interface/user/searchUser.interface';

const searchUserService = async ({ letters, userId }:ISearchUserRequest): Promise<User[]> => {
   const userRepository = AppDataSource.getRepository(User);

   const users = userRepository.find({
      where: { name: ILike(`%${letters}%`) }
   });

   return users;
};

export default searchUserService;
