import AppDataSource from '../../data-source';
import { Relationship } from '../../entities/relationship.entity';
import { User } from '../../entities/user.entity';
import { AppError } from '../../errors/appErrors';
import { IInviteFriendRequest } from '../../interface/user/inviteFriend.interface';

const inviteFriendService = async ({ userId, friendId }: IInviteFriendRequest): Promise<{ message: string }> => {
   const userRepository = AppDataSource.getRepository(User);
   const relationshipRepository = AppDataSource.getRepository(Relationship);

   const user = await userRepository.findOne({
      where: { id: userId },
      relations: [
         'relationshipsRequested',
         'relationshipsReceived',
         'relationshipsReceived.requester',
         'relationshipsRequested.addressee'
      ]
   });

   if (!user) {
      throw new AppError(404, 'Usuário não encontrado');
   }

   const friend = await userRepository.findOne({ where: { id: friendId } });

   if (!friend) {
      throw new AppError(404, 'Amigo não encontrado');
   }

   const requestAlreadyExists = await relationshipRepository.findOne({
      where: { requester: { id: userId }, addressee: { id: friendId } },
      relations: [ 'requester', 'addressee' ]
   });

   if (requestAlreadyExists) {
      throw new AppError(409, 'Convite já foi criado');
   }

   const requesterRelation = new Relationship();
   requesterRelation.requester = user;
   requesterRelation.addressee = friend;
   requesterRelation.type = 'requested';

   relationshipRepository.save(requesterRelation);

   return { message: 'Convite de amizade criado' };
};

export default inviteFriendService;
