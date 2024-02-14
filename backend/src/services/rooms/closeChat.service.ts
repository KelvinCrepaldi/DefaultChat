import AppDataSource from "../../data-source";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";

interface ICloseChatService {
  roomId: string;
  userId: string;
}

interface ICloseChatServiceResponse{
  message: string
}

const closeChatService = async ({roomId, userId}: ICloseChatService): Promise<ICloseChatServiceResponse> =>{
  const userRoomRepository = AppDataSource.getRepository(UserRoom)
  const userRoom = await userRoomRepository.findOne({
    where: {
      room: { id: roomId }, 
      user:{ id: userId }
    }, 
    relations:['room', 'user']
  })

  if(!userRoom){
    throw new AppError(404, `Chat room id:${roomId} not found`)
  }

  userRoom.isActive = false
  userRoomRepository.save(userRoom)

  return {message: "Room set to closed"}
}

export default closeChatService;