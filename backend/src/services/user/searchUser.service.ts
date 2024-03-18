import { ILike } from 'typeorm';
import AppDataSource from '../../data-source';
import { User } from '../../entities/user.entity';
import { ISearchUserRequest } from '../../interface/user/searchUser.interface';
import { AppError } from '../../errors/appErrors';
import { Relationship } from '../../entities/relationship.entity';

const searchUserService = async ({ letters, userId }:ISearchUserRequest): Promise<User[]> => {
   const userRepository = AppDataSource.getRepository(User);
   const relationshipRepository = AppDataSource.getRepository(Relationship)

   const user = await userRepository.findOne({
      where: {
         id: userId,
      },
   })

   if(!user){
      throw new AppError(404, 'User not found')
   }

   const relationsRequest = await relationshipRepository.find({
      where: {
         requester: {id: userId}
      },
      relations: ['requester', 'addressee']
   })

   if(!relationsRequest){
      throw new AppError(500, "error")
   }

   const relationsSent = await relationshipRepository.find({
      where: {
         addressee: {id: userId}
      },
      relations: ['requester', 'addressee']
   })

   if(!relationsSent){
      throw new AppError(500, "error")
   }

   const users = await userRepository.find({
      where: { name: ILike(`%${letters}%`) }
   });

   // filtrar proprio usuario
   const filterUsers = users.filter(userx => userx.id !== userId)


   // filtrar requisicoes enviadas
   const filterRequests = filterUsers.filter((userx) => 
      !relationsRequest.some((relationship) => relationship.addressee.id === userx.id)
   ); 

   // filtrar requisicoes recebidas
   const filterSents = filterRequests.filter((userx) => 
      !relationsSent.some((relationship) => relationship.requester.id === userx.id)
   ); 

   return filterSents;
};

export default searchUserService;
