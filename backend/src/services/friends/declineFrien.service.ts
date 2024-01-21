import AppDataSource from '../../data-source';
import { Relationship } from '../../entities/relationship.entity';
import { AppError } from '../../errors/appErrors';

const declineFriendService = async ({
   requestId,
   userId
}: {
   requestId: string;
   userId: string;
}): Promise<{ message: string }> => {
   const relationshipRepository = AppDataSource.getRepository(Relationship);

   const relation = await relationshipRepository.findOne({
      where: {
         id: requestId,
         addressee: {
            id: userId
         }
      },
      relations: [ 'requester', 'addressee' ]
   });

   if (!relation) {
      throw new AppError(404, 'Relation request not exist');
   }

   if (relation.type != 'requested') {
      throw new AppError(404, 'Relation request not exist');
   }

   await relationshipRepository.remove(relation);

   return { message: 'Convite de amizade recusado' };
};

export default declineFriendService;
