import AppDataSource from "../../data-source"
import { Message } from "../../entities/messages.enitity"
import { IListMessageServiceResponse, IListMessagesService } from "../../interface/messages/listMessages.interface"

const listMessagesService = async ({roomId}: IListMessagesService): Promise<IListMessageServiceResponse[]> =>{
  const messageRepository = AppDataSource.getRepository(Message)

  const messages = await messageRepository.find({
    where:{room:{id: roomId}}, 
    relations: ['room', 'user'],
    order:{
      createdAt: "DESC"
    },
    take: 20
  })

  const createMessagesResponse = messages.map((message)=>{
    return {
      message: message.message,
      user: {
        id: message.user.id,
        name: message.user.name,
        image: message.user.image
      },
      createdAt: message.user.createdAt
    }
  })
  return createMessagesResponse;
}

export default listMessagesService