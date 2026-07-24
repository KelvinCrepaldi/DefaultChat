import AppDataSource from "../../data-source";
import { Message } from "../../entities/messages.enitity";
import { MessageNotification } from "../../entities/messageNotification.entity";
import { Room } from "../../entities/room.entity";
import { User } from "../../entities/user.entity";
import { UserRoom } from "../../entities/userRoom.entity";
import { AppError } from "../../errors/appErrors";
import {
  IGroupRoomDetail,
  IJoinGroupService,
} from "../../interface/room/groupRooms.interface";

const joinGroupService = async ({
  userId,
  roomId,
}: IJoinGroupService): Promise<IGroupRoomDetail> => {
  const userRepository = AppDataSource.getRepository(User);
  const roomRepository = AppDataSource.getRepository(Room);
  const userRoomRepository = AppDataSource.getRepository(UserRoom);
  const messageRepository = AppDataSource.getRepository(Message);
  const notificationRepository =
    AppDataSource.getRepository(MessageNotification);

  const user = await userRepository.findOne({ where: { id: userId } });
  if (!user) {
    throw new AppError(404, "User not found");
  }

  const room = await roomRepository.findOne({
    where: { id: roomId },
    relations: ["roomUsers", "roomUsers.user"],
  });

  if (!room || room.type !== "group") {
    throw new AppError(404, "Group not found");
  }

  let userRoom = await userRoomRepository.findOne({
    where: {
      room: { id: roomId },
      user: { id: userId },
    },
    relations: ["room", "user"],
  });

  if (userRoom) {
    if (userRoom.isActive) {
      throw new AppError(400, "You are already in this group");
    }
    userRoom.isActive = true;
    await userRoomRepository.save(userRoom);
  } else {
    userRoom = new UserRoom();
    userRoom.isActive = true;
    userRoom.room = room;
    userRoom.user = user;
    await userRoomRepository.save(userRoom);
  }

  const refreshedRoom = await roomRepository.findOne({
    where: { id: roomId },
    relations: ["roomUsers", "roomUsers.user"],
  });

  if (!refreshedRoom) {
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

  const users = refreshedRoom.roomUsers.map((ru) => ({
    id: ru.user.id,
    name: ru.user.name,
    email: ru.user.email,
    image: ru.user.image ?? null,
  }));

  return {
    id: refreshedRoom.id,
    name: refreshedRoom.name,
    image: refreshedRoom.image ?? null,
    type: refreshedRoom.type,
    users,
    messages,
    notification: notifications.length,
  };
};

export default joinGroupService;
