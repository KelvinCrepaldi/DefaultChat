import AppDataSource from '../../data-source';
import { Relationship } from '../../entities/relationship.entity';

import { IListFriendsRequest } from '../../interface/friends/friend.interface';

const listFriendsService = async ({ userId }: IListFriendsRequest): Promise<Relationship[]> => {
   const relationshipRepository = AppDataSource.getRepository(Relationship);

   const relationships = await relationshipRepository.find({
      where: [
         { requester: { id: userId }, type: 'accepted' },
         { addressee: { id: userId }, type: 'accepted' },
      ],
      relations: [ 'requester', 'addressee' ],
      select: {
         requester: { id: true, name: true, email: true, image: true },
         addressee: { id: true, name: true, email: true, image: true },
      }
   });

   // Normalize so addressee is always the other user (frontend expects friend.addressee)
   const friendsById = new Map<string, Relationship>();

   for (const relationship of relationships) {
      const otherUser =
         relationship.requester.id === userId
            ? relationship.addressee
            : relationship.requester;

      if (!friendsById.has(otherUser.id)) {
         friendsById.set(otherUser.id, {
            ...relationship,
            addressee: otherUser,
         });
      }
   }

   return Array.from(friendsById.values());
};

export default listFriendsService;
