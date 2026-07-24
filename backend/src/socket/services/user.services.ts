
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

  const getAcceptedFriendIds = async (userId: string): Promise<string[]> => {
    const relationships = await AppDataSource.getRepository(Relationship).find({
      where: [
        { requester: { id: userId }, type: "accepted" },
        { addressee: { id: userId }, type: "accepted" },
      ],
      relations: ['addressee', 'requester']
    })

    const friendIds = new Set<string>()
    for (const relationship of relationships) {
      const otherUserId =
        relationship.requester.id === userId
          ? relationship.addressee.id
          : relationship.requester.id
      friendIds.add(otherUserId)
    }
    return Array.from(friendIds)
  }

  const userListReady = async (usersOnline: IUsersOnline[], {userId, activeRooms}: IUserReadySocket) =>{
    try {
      const friendIds = await getAcceptedFriendIds(userId)
    
      if (friendIds.length) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>
          friendIds.includes(user.userId)
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
      const friendIds = await getAcceptedFriendIds(userId)
   
      if (friendIds.length) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>
          friendIds.includes(user.userId)
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