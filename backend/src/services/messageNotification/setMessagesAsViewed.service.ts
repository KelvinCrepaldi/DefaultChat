import AppDataSource from "../../data-source"
import { MessageNotification } from "../../entities/messageNotification.entity";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { ISetMessageAsViewed } from "../../interface/messageNotification/setMessagesAsViewed.interface";

const setMessagesAsViewedService = async ({userId, roomId}:ISetMessageAsViewed): Promise<void> =>{
  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const messageNotificationRepository = AppDataSource.getRepository(MessageNotification)

  const user = await userRepository.findOne({where:{id: userId}})

  if(!user){
    throw new AppError(404, "User not found.")
  }

  const room = await roomRepository.findOne({where:{id: roomId}})

  if(!room){
    throw new AppError(404, "Room not found.")
  }

  const notifications = await messageNotificationRepository.find({where:{room: {id : roomId}, user: {id: userId}, viewed: false}})

  notifications.forEach((notification) => notification.viewed = true)

  await messageNotificationRepository.save(notifications)
}

export default setMessagesAsViewedService;