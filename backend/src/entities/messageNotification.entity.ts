import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Message } from "./messages.enitity";
import { Room } from "./room.entity";

@Entity('messagesNotifications')
export class MessageNotification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  viewed: boolean

  @ManyToOne(()=> User, (user) => user.messageNotifications)
  user: User

  @ManyToOne(()=> Room, (room)=> room.messageNotifications)
  room: Room

  @ManyToOne(()=> Message, (message)=> message.messageNotifications)
  message: Message
}