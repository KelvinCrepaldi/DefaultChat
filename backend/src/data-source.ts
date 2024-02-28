import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { UserRoom } from './entities/userRoom.entity';
import { Room } from './entities/room.entity';
import { CreateTables1707251681489 } from './migrations/1707251681489-createTables';
import { AddRoomImage1707774966587 } from './migrations/1707774966587-addRoomImage';
import { Message } from './entities/messages.enitity';
import { CreateMessagesTable1707780491768 } from './migrations/1707780491768-createMessagesTable';
import { MessageNotification } from './entities/messageNotification.entity';
import { MessageNotificationTable1708623078024 } from './migrations/1708623078024-messageNotificationTable';
import { AddRoomOnMessageNotification1709131069577 } from './migrations/1709131069577-addRoomOnMessageNotification';


const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST,
   port: parseInt(process.env.PGPORT || ''),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   synchronize: false,
   logging: false,
   entities: [ 
      User, 
      Relationship, 
      UserRoom, 
      Room, 
      Message, 
      MessageNotification 
   ],
   subscribers: [],
   migrations: [
      CreateTables1707251681489,
      AddRoomImage1707774966587,
      CreateMessagesTable1707780491768,
      MessageNotificationTable1708623078024,
      AddRoomOnMessageNotification1709131069577
   ]
});

AppDataSource.initialize()
   .then(() => {
      console.log('Data Source has been initialized!');
   })
   .catch(err => {
      console.error('Error during Data Source initialization', err);
   });

export default AppDataSource;
