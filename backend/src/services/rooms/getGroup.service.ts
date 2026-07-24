import AppDataSource from "../../data-source";
import { Message } from "../../entities/messages.enitity";
import { MessageNotification } from "../../entities/messageNotification.entity";
import { Room } from "../../entities/room.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import {
  IGetGroupService,
  IGroupRoomDetail,
} from "../../interface/room/groupRooms.interface";

const getGroupService = async ({
  userId,
  roomId,
}: IGetGroupService): Promise<IGroupRoomDetail> => {
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom);
  const messageRepository = AppDataSource.getRepository(Message);
  const notificationRepository =
    AppDataSource.getRepository(MessageNotification);

  const membership = await userRoomRepository.findOne({
    where: {
      room: { id: roomId },
      user: { id: userId },
      isActive: true,
    },
  });

  if (!membership) {
    throw new AppError(403, "You are not a member of this group");
  }

  const room = await roomRepository.findOne({
    where: { id: roomId },
    relations: ["roomUsers", "roomUsers.user"],
  });

  if (!room || room.type !== "group") {
    throw new AppError(404, "Group not found");
  }

  const messages = await messageRepository.find({
    where: { room: { id: roomId } },
    relations: ["user", "room"],
    order: { createdAt: "ASC" },
  });

  const notifications = await notificationRepository.find({
    where: {
      room: { id: roomId },
      user: { id: userId },
      viewed: false,
    },
  });

  return {
    id: room.id,
    name: room.name,
    image: room.image ?? null,
    type: room.type,
    users: room.roomUsers.map((ru) => ({
      id: ru.user.id,
      name: ru.user.name,
      email: ru.user.email,
      image: ru.user.image ?? null,
    })),
    messages,
    notification: notifications.length,
  };
};

export default getGroupService;
