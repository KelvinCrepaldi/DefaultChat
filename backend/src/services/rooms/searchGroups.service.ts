import { ILike } from "typeorm";
import AppDataSource from "../../data-source";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import {
  ISearchGroupItem,
  ISearchGroupsService,
} from "../../interface/room/groupRooms.interface";

const searchGroupsService = async ({
  userId,
  letters,
}: ISearchGroupsService): Promise<ISearchGroupItem[]> => {
  const trimmed = letters?.trim();
  if (!trimmed) {
    throw new AppError(400, "Search letters are required");
  }

  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom);

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const rooms = await roomRepository.find({
    where: {
      type: "group",
      name: ILike(`%${trimmed}%`),
    },
    relations: ["roomUsers", "roomUsers.user"],
  });

  const activeMemberships = await userRoomRepository.find({
    where: {
      user: { id: userId },
      isActive: true,
      room: { type: "group" },
    },
    relations: ["room"],
  });
  const activeRoomIds = new Set(activeMemberships.map((m) => m.room.id));

  return rooms
    .filter((room) => !activeRoomIds.has(room.id))
    .map((room) => ({
      id: room.id,
      name: room.name,
      image: room.image ?? null,
      memberCount: room.roomUsers?.length ?? 0,
    }));
};

export default searchGroupsService;
