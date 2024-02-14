import AppDataSource from "../../data-source";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";

const privateRoomService = async ({friendId, userId}:{friendId: string, userId: string}): Promise<Room> =>{
  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom)

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
      'userRooms.room.roomUsers.user', 
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
    const test = await userRoomRepository.save(roomExists)
  
    const room = roomRepository.create({
      id: roomExists.room.id,
      type: roomExists.room.type,
      creator: roomExists.room.creator,
      name: roomExists.room.name,
      admin: roomExists.room.admin
    })
    return room
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

  return newRoom;
}

export default privateRoomService;