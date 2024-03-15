import AppDataSource from "../../data-source";
import { MessageNotification } from "../../entities/messageNotification.entity";
import { Message } from "../../entities/messages.enitity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";

interface IListActiveRooms {
  userId: string;
}

interface IPrivateRoom {
  id: string,
  name: string,
  image: string,
  user: {
    id: string
    name: string,
    email: string,
    image:string,
  },
  messages: any[],
  notification: number;
} 
interface IGroupRoom{ 
  id: string,
  name: string,
  image: string,
  users: {
    id: string
    name: string,
    email: string,
    image:string,
  }[],
}

interface IListActiveRoomsResponse{
  privateRooms: IPrivateRoom[],
  groupRooms:IGroupRoom[],
}

export const listActiveRoomsService = async ({
  userId
}:IListActiveRooms): Promise<IListActiveRoomsResponse> =>{
  const userRepository = AppDataSource.getRepository(User);
  const messageNotificationRepository = AppDataSource.getRepository(MessageNotification)

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
            const filterNotifications = userRoom.room.messageNotifications.filter((notification) => notification.user.id === userId && notification.viewed === false);
            
            const sortMessage = userRoom.room.messages.sort((a,b) => {
              const dateA = new Date(b.createdAt) 
              const dateB = new Date(b.createdAt) 
              return dateA.getTime() - dateB.getTime();
            });
            console.log(sortMessage)

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

  // Filter out null values after resolving promises
  const filteredPrivateRooms = privateRooms.filter((room): room is IPrivateRoom => room !== null);

  const groupRooms = roomsList.userRooms.map((userRoom) => {
    const friendsInfo = userRoom.room.roomUsers.filter((roomUser) => roomUser.user.id !== userId);
    const friendsList = friendsInfo.map((friend) => ({
      id: friend.user.id,
      name: friend.user.name,
      email: friend.user.email,
      image: friend.user.image,
    }));
    if (userRoom.room.type === 'group') {
      return {
        id: userRoom.room.id,
        name: userRoom.room.name,
        image: userRoom.room.image,
        users: friendsList,
      };
    }
  })
  .filter((room): room is NonNullable<typeof room> => !!room);

  // Find notifications

  return {
    privateRooms: filteredPrivateRooms,
    groupRooms: groupRooms
  };
}

export default listActiveRoomsService;