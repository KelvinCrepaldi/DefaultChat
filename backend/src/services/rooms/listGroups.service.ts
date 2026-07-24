import AppDataSource from "../../data-source";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import { ISearchGroupItem } from "../../interface/room/groupRooms.interface";

export type IListGroupItem = ISearchGroupItem & {
  isMember: boolean;
};

const listGroupsService = async ({
  userId,
}: {
  userId: string;
}): Promise<IListGroupItem[]> => {
  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom);

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const rooms = await roomRepository.find({
    where: { type: "group" },
    relations: ["roomUsers", "roomUsers.user"],
    order: { name: "ASC" },
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

  return rooms.map((room) => ({
    id: room.id,
    name: room.name,
    image: room.image ?? null,
    memberCount: room.roomUsers?.length ?? 0,
    isMember: activeRoomIds.has(room.id),
  }));
};

export default listGroupsService;
