import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne  } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";


@Entity('messages')
export class Message{
  @PrimaryGeneratedColumn('uuid')
  id:string;

  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(()=> User, (user)=> user.messages)
  user: User;

  @ManyToOne(()=> Room, (room)=> room.messages)
  room: Room;
}