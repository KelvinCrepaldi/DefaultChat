import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('relationship')
export class Relationship {
   @PrimaryGeneratedColumn('uuid')
   id: string;

   @ManyToOne(() => User, user => user.relationshipsRequested)
   requester: User;

   @ManyToOne(() => User, user => user.relationshipsReceived)
   addressee: User;

   @CreateDateColumn()
   createdAt: Date;

   @Column()
   type: string;
}
