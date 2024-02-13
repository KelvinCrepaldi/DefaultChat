import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";

interface IListActiveRooms {
  userId: string;
}

interface IListActiveRoomsResponse{
  privateRooms:{
    id: string,
    name: string,
    image: string,
    user: {
      id: string
      name: string,
      email: string,
      image:string;
    },
  }[] 
  groupRooms:{
    id: string,
    name: string,
    image: string,
    users: {
      id: string
      name: string,
      email: string,
      image:string;
    }[],
  }[] 
}

export const listActiveRoomsService = async ({
  userId
}:IListActiveRooms): Promise<IListActiveRoomsResponse> =>{

  const userRepository = AppDataSource.getRepository(User);

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
      'userRooms.room.roomUsers.user'
    ]
  })

  if(!roomsList){
    return {
      privateRooms: [],
      groupRooms: []
    }
  }

  const privateRooms = roomsList.userRooms
  .map((userRoom) => {
    const friendInfo = userRoom.room.roomUsers.find((roomUser) => roomUser.user.id !== userId);
    if (friendInfo && userRoom.room.type === 'private') {
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
      };
    }
  })
  .filter((room): room is NonNullable<typeof room> => !!room);

  const groupRooms = roomsList.userRooms
  .map((userRoom) => {
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

  return {
    privateRooms: privateRooms,
    groupRooms: groupRooms
  };
}

export default listActiveRoomsService;