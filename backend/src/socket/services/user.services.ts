
import { Server, Socket } from "socket.io";
import AppDataSource from "../../data-source";
import { Relationship } from "../../entities/relationship.entity";
import { IUserReadySocket, IUserRegisterSocket, IUsersOnline } from "../../interface/socket";

const userServices = (io: Server, socket: Socket) =>{
  const registerUser = (usersOnline: IUsersOnline[], {userId}: IUserRegisterSocket) =>{
    for (let room in socket.rooms) {
      if (room !== socket.id) {
          socket.leave(room);
      }
    }

    const alreadyRegistered = usersOnline.find((user) => user.userId === userId);
    if(!alreadyRegistered){
      usersOnline.push({
        socketId: socket.id,
        userId: userId
      })
    }
  }

  const userListReady = async (usersOnline: IUsersOnline[], {userId, activeRooms}: IUserReadySocket) =>{
    try {
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            id: userId
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
    
      if (friends) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>
        friends.some((friend: Relationship) => friend.addressee.id === user.userId)
        );
        
        //Notifying friends that the user has come online
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friend:isOnline', { userId: userId });
        });
        
        //Returning to the user the friends who are online
        io.to(socket.id).emit('friend:listOnline', onlineFriends);
      }

      activeRooms.forEach((room: any) =>{
        socket.join(room)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const disconnect = async (usersOnline: IUsersOnline[]) =>{
    const userId = usersOnline.find((user)=> user.socketId === socket.id)?.userId
    if(userId){
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            id: userId
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
   
      if (friends) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>

        friends.some((friend: Relationship) => friend.addressee.id === user.userId)
        );
  
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friend:isOffline', { userId: userId });
        });
      }

      socket.disconnect();
      return usersOnline.filter((user)=> user.socketId !== socket.id);
    }
  }

  return {
    registerUser, 
    userListReady,
    disconnect
  }
}

export default userServices;