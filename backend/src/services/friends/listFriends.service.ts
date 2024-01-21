import AppDataSource from '../../data-source';
import { Relationship } from '../../entities/relationship.entity';

import { IListFriendsRequest } from '../../interface/friends/friend.interface';

const listFriendsService = async ({ userId }: IListFriendsRequest): Promise<Relationship[]> => {
   const relationshipRepository = AppDataSource.getRepository(Relationship);

   const friends = await relationshipRepository.find({
      where: { requester: { id: userId }, type: 'accepted' },
      relations: [ 'addressee' ],
      select: {
         addressee: { id: true, name: true, email: true, image: true }
      }
   });

   return friends;
};

export default listFriendsService;
