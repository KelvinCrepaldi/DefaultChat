import AppDataSource from '../../data-source'
import { Relationship } from '../../entities/relationship.entity'
import { type FriendRequestsResponse } from '../../interface/friends/friend.interface'

const listReceivedFriendRequestsService = async ({
  userId
}: {
  userId: string
}): Promise<Relationship[]> => {
  const relationshipRepository = AppDataSource.getRepository(Relationship);

  const requests = await relationshipRepository.find({
     where: { addressee: { id: userId }, type: 'requested' },
     relations: [ 'requester' ],
     select: {
        requester: { id: true, name: true, email: true, image: true }
     }
  });

  return requests;
}

export default listReceivedFriendRequestsService
