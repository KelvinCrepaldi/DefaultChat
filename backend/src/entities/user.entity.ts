import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from 'typeorm';
import { Relationship } from './relationship.entity';
import { UserRoom } from './userRoom.entity';
import { Message } from './messages.enitity';

@Entity('users')
export class User {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @Column()
   name: string;

   @Column()
   email: string;

   @Column()
   password: string;

   @Column({ nullable: true })
   image: string;

   @CreateDateColumn()
   createdAt: Date;

   @UpdateDateColumn()
   updatedAt: Date;

   @OneToMany(() => Relationship, relationship => relationship.requester)
   relationshipsRequested: Relationship[];

   @OneToMany(() => Relationship, relationship => relationship.addressee)
   relationshipsReceived: Relationship[];

   @OneToMany(()=> UserRoom, userRoom => userRoom.user)
   userRooms: UserRoom[]

   @OneToMany(()=> Message, (message )=> message.user)
   messages: Message;
}
