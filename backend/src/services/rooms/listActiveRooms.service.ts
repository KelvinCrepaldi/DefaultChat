import AppDataSource from "../../data-source";
import { MessageNotification } from "../../entities/messageNotification.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { IGroupRoom, IListActiveRooms, IListActiveRoomsResponse, IPrivateRoom } from "../../interface/room/listActiveRooms.interface";

export const listActiveRoomsService = async ({
  userId
}:IListActiveRooms): Promise<IListActiveRoomsResponse> =>{
  const userRepository = AppDataSource.getRepository(User);

  const user = await userRepository.findOne({where: {id: userId}})

  if(!user){
    throw new AppError(404, "User not found.")
  }

  const roomsList = await userRepository.findOne({
    where:{
      id:userId,
      userRooms:{
        isActive: true
      }
    }, 
    relations:[
      'userRooms',
      'userRooms.room',
      'userRooms.room.roomUsers',
      'userRooms.room.roomUsers.user',
      'userRooms.room.messages',
      'userRooms.room.messages.user',
      'userRooms.room.messageNotifications',
      'userRooms.room.messageNotifications.message',
      'userRooms.room.messageNotifications.user'
    ]
  })

  if(!roomsList){
    return {
      privateRooms: [],
      groupRooms: []
    }
  }

  const privateRooms = await Promise.all(
    roomsList.userRooms.map(async (userRoom) => {
        const friendInfo = userRoom.room.roomUsers.find((roomUser) => roomUser.user.id !== userId);

        if (friendInfo && userRoom.room.type === 'private') {
            const filterNotifications = userRoom.room.messageNotifications.filter((notification) => 
            notification.user.id === userId && notification.viewed === false);
            
            const sortMessage = userRoom.room.messages.sort((a,b) => {
              const dateA = new Date(a.createdAt) 
              const dateB = new Date(b.createdAt) 
              return dateA.getTime() - dateB.getTime();
            });

            return {
                id: userRoom.room.id,
                name: friendInfo.user.name,
                image: friendInfo.user.image,
                user: {
                    id: friendInfo.user.id,
                    name: friendInfo.user.name,
                    email: friendInfo.user.email,
                    image: friendInfo.user.image,
                },
                messages: sortMessage,
                notification: filterNotifications.length
            };
        } else {
            return null;
        }
    })
  );

  const filteredPrivateRooms = privateRooms.filter((room): room is IPrivateRoom => room !== null);

  const groupRooms = roomsList.userRooms.map((userRoom) => {
    if (userRoom.room.type !== 'group') {
      return null;
    }

    const membersList = userRoom.room.roomUsers.map((member) => ({
      id: member.user.id,
      name: member.user.name,
      email: member.user.email,
      image: member.user.image,
    }));

    const filterNotifications = userRoom.room.messageNotifications.filter((notification) =>
      notification.user.id === userId && notification.viewed === false
    );

    const sortMessage = [...userRoom.room.messages].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateA.getTime() - dateB.getTime();
    });

    return {
      id: userRoom.room.id,
      name: userRoom.room.name,
      image: userRoom.room.image,
      users: membersList,
      messages: sortMessage,
      notification: filterNotifications.length,
    } as IGroupRoom;
  }).filter((room): room is IGroupRoom => room !== null);

  return {
    privateRooms: filteredPrivateRooms,
    groupRooms: groupRooms
  };
}

export default listActiveRoomsService;
