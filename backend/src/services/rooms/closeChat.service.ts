import AppDataSource from "../../data-source";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";

interface ICloseChatService {
  id: string;
}

interface ICloseChatServiceResponse{
  message: string
}

const closeChatService = async ({id}: ICloseChatService): Promise<ICloseChatServiceResponse> =>{
  const userRoomRepository = AppDataSource.getRepository(UserRoom)
  const userRoom = await userRoomRepository.findOne({where: {id: id}})

  if(!userRoom){
    throw new AppError(404, `Chat room id:${id} not found`)
  }

  userRoom.isActive = false
  userRoomRepository.save(userRoom)

  return {message: "Room set to closed"}
}

export default closeChatService;