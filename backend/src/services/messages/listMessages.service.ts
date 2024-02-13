import AppDataSource from "../../data-source"
import { Message } from "../../entities/messages.enitity"

interface IListMessagesService {
  roomId: string;
}

const listMessagesService = async ({roomId}: IListMessagesService): Promise<Message[]> =>{
  const messageRepository = AppDataSource.getRepository(Message)

  const messages = await messageRepository.find({where:{room:{id: roomId}}, relations: ['room']})

  return messages;
}

export default listMessagesService