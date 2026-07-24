import AppDataSource from "../../data-source";
import { Message } from "../../entities/messages.enitity";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import { IPrivateRoom } from "../../interface/room/privateRooms.interface";

const privateRoomService = async ({friendId, userId}:{friendId: string, userId: string}): Promise<IPrivateRoom> =>{
  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom)
  const messageRepository = AppDataSource.getRepository(Message);

  const user = await userRepository.findOne({
    where: {id: userId}, 
    relations: [
    'userRooms.room.roomUsers.user', 
    ] 
  })
  
  if (!user) {
    throw new AppError(404, "User not found")
  }

  const friend = await userRepository.findOne({
    where: {id: friendId}, 
    relations: [
      'userRooms',
      'userRooms.room',
      'userRooms.room.roomUsers',
      'userRooms.room.roomUsers.user',
      'userRooms.room.messages',
      'userRooms.room.messages.user',
    ]
  })

  if (!friend) {
    throw new AppError(404, "User not found")
  }

  // verify if room exists and return
  const roomExists = user.userRooms.find(element => {
    const hasUserId = element.room.roomUsers.some(register => register.user.id === userId);
    const hasFriendId = element.room.roomUsers.some(register => register.user.id === friendId);

    return hasUserId && hasFriendId && (element.room.type === 'private');
  });

  if(roomExists){
    roomExists.isActive = true;
    await userRoomRepository.save(roomExists)

    const messages = await messageRepository.find({
        where: {
          room: {
            id: roomExists.room.id
          }
        }, 
        relations:['room', 'user'],
        select: {
          id: true,
          message: true,
          createdAt: true,
          user:{
            email: true,
            name: true,
            image: true
          },
          room:{}
        }
      })

    return {
      id: roomExists.room.id,
      name: friend.name,
      image: friend.image,
      user: {
        id: friend.id,
        name: friend.name,
        email: friend.email,
        image: friend.image,
      },
      messages
    };
  }

  // create room if not exists.
  const newRoom = new Room();
  newRoom.creator = user.id
  newRoom.type = "private"
  await roomRepository.save(newRoom)

  const addUserOnRoom = new UserRoom()
  addUserOnRoom.isActive = true
  addUserOnRoom.room = newRoom;
  addUserOnRoom.user = user;
  await userRoomRepository.save(addUserOnRoom)

  const addFriendOnRoom = new UserRoom()
  addFriendOnRoom.isActive = true
  addFriendOnRoom.room = newRoom;
  addFriendOnRoom.user = friend;
  await userRoomRepository.save(addFriendOnRoom)

  return {
    id: newRoom.id,
    name: friend.name,
    image: friend.image,
    user: {
      id: friend.id,
      name: friend.name,
      email: friend.email,
      image: friend.image,
    },
    messages: []
  };

}

export default privateRoomService;