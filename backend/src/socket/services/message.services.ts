import AppDataSource from "../../data-source";

import { Server, Socket } from "socket.io"
import { Message } from "../../entities/messages.enitity";
import { IClientMessage, IUsersOnline } from "../../interface/socket";
import { User } from "../../entities/user.entity";
import { Room } from "../../entities/room.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { MessageNotification } from "../../entities/messageNotification.entity";
import createMessageService from "../../services/messages/createMessage.service";


const messageServices = (io: Server, socket: Socket)=>{
  const userRepository = AppDataSource.getRepository(User)
  const roomRepository = AppDataSource.getRepository(Room)
  const userRoomRepository = AppDataSource.getRepository(UserRoom)

  const sendMessage = async (usersOnline: IUsersOnline[], {message, user, roomId}: IClientMessage) =>{
      const dateNow = Date.now();
      const createdAt = new Date(dateNow)
      io.to(roomId).emit("send_message", {message, user, roomId, createdAt})
  
      try {
        const room = await roomRepository.findOne({where: {id: roomId}, relations: ['roomUsers', 'roomUsers.user'] })
        const messageNotificationRepository = AppDataSource.getRepository(MessageNotification)
  
        //open room if is closed
        const userRoom = await userRoomRepository.findOne({
          where:{room: {id: roomId}, user:{id: user.id}, isActive: false}
        })
        if(userRoom?.isActive === false){
          userRoom.isActive = true
          await userRoomRepository.save(userRoom)
        }
  
        if(!room){
          throw new Error
        }
  
        //save message on database 
          const newMessage: Message = await createMessageService({message, roomId, userId: user.id})
  
        
          if(newMessage){
            //create notification on database for offline users
            const removeSender = room.roomUsers.filter((x) => x.user.id !== user.id  )
            removeSender.forEach(async (user)=>{
              const userIsOffline = usersOnline.some((userOnline)=>userOnline.userEmail === user.user.email)
              
              if(!userIsOffline){
                const userExists = await userRepository.findOne({where: {id: user.user.id}})
                if(userExists){
                  const newNotification = new MessageNotification();
                  newNotification.message = newMessage
                  newNotification.user = userExists;
                  newNotification.room = room;
                  newNotification.viewed = false;
                  await messageNotificationRepository.save(newNotification)
                }
              } 
            })
          }
      } catch (error) {
        console.log(error)
      }
  }

  return { sendMessage }
}

export default messageServices