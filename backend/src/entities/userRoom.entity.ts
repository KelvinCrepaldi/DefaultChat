import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, ManyToOne } from "typeorm";
import { User } from "./user.entity";
import { Room } from "./room.entity";

@Entity('userRooms')
export class UserRoom {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  isActive: boolean;

  @ManyToOne(()=>User, user => user.userRooms)
  user: User

  @ManyToOne(()=>Room, room=> room.roomUsers)
  room: Room

}