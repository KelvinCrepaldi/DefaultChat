
import { Server, Socket } from "socket.io";
import AppDataSource from "../../data-source";
import { Relationship } from "../../entities/relationship.entity";
import { IUsersOnline } from "../../interface/socket";

const userServices = (io: Server, socket: Socket) =>{
  const registerUser = (usersOnline: IUsersOnline[], data: any) =>{
    for (let room in socket.rooms) {
      if (room !== socket.id) {
          socket.leave(room);
      }
    }

    const alreadyRegistered = usersOnline.find((user) => user.userEmail === data.userEmail);
    if(!alreadyRegistered){
      usersOnline.push({
        socketId: socket.id,
        userEmail: data.userEmail
      })
    }
  }

  const userListReady = async (usersOnline: IUsersOnline[], {userEmail, activeRooms}: any) =>{
    try {
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            email: userEmail
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
    
      if (friends) {
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>
        friends.some((friend: Relationship) => friend.addressee.email === user.userEmail)
        );
        
        //Notifying friends that the user has come online
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friendIsOnline', { userEmail: userEmail });
        });
        
        //Returning to the user the friends who are online
        io.to(socket.id).emit('friendsOnline', onlineFriends);
      }

      activeRooms.forEach((room: any) =>{
        socket.join(room)
      })
    } catch (error) {
      console.log(error)
    }
  }

  const disconnect = async (usersOnline: IUsersOnline[]) =>{
    const userEmail = usersOnline.find((user)=> user.socketId === socket.id)?.userEmail
    if(userEmail){
      const friends = await AppDataSource.getRepository(Relationship).find({
        where:{
          requester:{
            email: userEmail
          },
          type: "accepted"
        },
        relations: ['addressee', 'requester']
      })
   
      if (friends) {
        usersOnline = usersOnline.filter((user)=> user.socketId !== socket.id)
        const onlineFriends = usersOnline.filter((user: IUsersOnline) =>

        friends.some((friend: Relationship) => friend.addressee.email === user.userEmail)
        );
  
        onlineFriends.forEach((friend: IUsersOnline) => {
          io.to(friend.socketId).emit('friendIsOffline', { userEmail: userEmail });
        });
      }
      
      socket.disconnect();
    }
  }

  return {
    registerUser, 
    userListReady,
    disconnect
  }
}

export default userServices;