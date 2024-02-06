import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from "typeorm";
import { User } from "./user.entity";
import { UserRoom } from "./userRoom.entity";

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  type: string;

  @Column()
  creator: string;

  @Column({nullable: true})
  name: string;

  @Column({nullable: true})
  admin: string;

  @OneToMany(()=> UserRoom, userRoom => userRoom.room)
  roomUsers: UserRoom[]

}