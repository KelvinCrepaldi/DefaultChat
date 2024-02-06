import AppDataSource from "../../data-source";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";

interface IListActiveRooms {
  userId: string;
}

interface IListActiveRoomsResponse{
  id: string,
  user: {
    id: string
    name: string,
    email: string,
    image:string;
  },
}

export const listActiveRoomsService = async ({
  userId
}:IListActiveRooms): Promise<IListActiveRoomsResponse[]> =>{

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
    return []
  }

  const filteredRooms  = roomsList.userRooms.map( userRoom =>{
    const friendInfo = userRoom.room.roomUsers.filter((roomUser) =>{
      return roomUser.user.id != userId
    })[0]

    return {
      id: userRoom.id,
      user: {
        id: friendInfo.user.id,
        name: friendInfo.user.name,
        email: friendInfo.user.email,
        image: friendInfo.user.image
      } ,
    }
  })

  return filteredRooms;
}

export default listActiveRoomsService;