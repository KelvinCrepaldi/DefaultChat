import AppDataSource from "../../data-source";
import { Message } from "../../entities/messages.enitity";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { AppError } from "../../errors/appErrors";
import { ICreateMessageService } from "../../interface/messages/createMessage.interface";



const createMessageService = async ({message, userId, roomId}:ICreateMessageService): Promise<Message> =>{
  const messageRepository = AppDataSource.getRepository(Message)
  const userRepository = AppDataSource.getRepository(User)
  const roomRepository = AppDataSource.getRepository(Room)

  const user = await userRepository.findOne({where:{ id: userId}})
  if(!user){
    throw new AppError(404, "user not found")
  }

  const room = await roomRepository.findOne({where:{id:roomId}})
  if(!room){
    throw new AppError(404, "room not found")
  }

  const newMessage = new Message()
  newMessage.message = message;
  newMessage.room = room;
  newMessage.user = user;

  await messageRepository.save(newMessage)

  return newMessage
}

export default createMessageService;