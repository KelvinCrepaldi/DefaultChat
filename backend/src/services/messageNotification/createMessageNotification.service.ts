import { throws } from "assert"
import AppDataSource from "../../data-source"
import { MessageNotification } from "../../entities/messageNotification.entity"
import { Message } from "../../entities/messages.enitity"
import { Room } from "../../entities/room.entity"
import { AppError } from "../../errors/appErrors"

export interface ICreateMessageNotification {
  messageId: string,
  userId: string
}

const createMessageNotification = async  ({messageId, userId}: ICreateMessageNotification) =>{
  const messageRepository = AppDataSource.getRepository(Message)
  const messageNotificationRepository = AppDataSource.getRepository(MessageNotification)

  const message = await messageRepository.findOne({where: {id: messageId}, relations: ['room, room.roomUsers']})

  if(!message) throw new AppError(404, 'message not found')

  const usersOnChat = message.room.roomUsers.filter((roomUser) => roomUser.user.id !== userId)
}

export default createMessageNotification