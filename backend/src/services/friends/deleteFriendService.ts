import AppDataSource from '../../data-source';
import { Relationship } from '../../entities/relationship.entity';
import { AppError } from '../../errors/appErrors';
import { IDeleteFriendRequest, IDeleteFriendResponse } from '../../interface/friends/friend.interface';

const deleteFriendService = async ({
   userId,
   friendId
}: IDeleteFriendRequest): Promise<IDeleteFriendResponse> => {
   const relationshipRepository = AppDataSource.getRepository(Relationship);

   const userRelation = await relationshipRepository.findOne({
      where: {
         requester: {
            id: userId
         },
         addressee: {
            id: friendId
         },
         type: 'accepted'
      },
      relations: [ 'requester', 'addressee' ]
   });
   if (!userRelation) {
      throw new AppError(404, 'Relacionamento de amizade não encontrado');
   }
   console.log('1');

   const friendRelation = await relationshipRepository.findOne({
      where: {
         requester: {
            id: friendId
         },
         addressee: {
            id: userId
         },
         type: 'accepted'
      },
      relations: [ 'requester', 'addressee' ]
   });

   console.log('2');

   if (!friendRelation) {
      throw new AppError(404, 'Relacionamento de amizade não encontrado');
   }

   await relationshipRepository.remove(userRelation);
   await relationshipRepository.remove(friendRelation);

   return { message: 'Usuário removido da lista de amigos.' };
};

export default deleteFriendService;
