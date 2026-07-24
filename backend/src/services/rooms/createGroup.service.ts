import AppDataSource from "../../data-source";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import {
  ICreateGroupResponse,
  ICreateGroupService,
} from "../../interface/room/groupRooms.interface";

const createGroupService = async ({
  userId,
  name,
}: ICreateGroupService): Promise<ICreateGroupResponse> => {
  const trimmedName = name?.trim();
  if (!trimmedName) {
    throw new AppError(400, "Group name is required");
  }

  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom);

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const newRoom = new Room();
  newRoom.type = "group";
  newRoom.name = trimmedName;
  newRoom.creator = user.id;
  newRoom.admin = user.id;
  await roomRepository.save(newRoom);

  const userRoom = new UserRoom();
  userRoom.isActive = true;
  userRoom.room = newRoom;
  userRoom.user = user;
  await userRoomRepository.save(userRoom);

  return {
    id: newRoom.id,
    name: newRoom.name,
    image: newRoom.image ?? null,
    type: newRoom.type,
    memberCount: 1,
  };
};

export default createGroupService;
