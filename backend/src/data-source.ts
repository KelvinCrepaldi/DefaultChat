import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { UserRoom } from './entities/userRoom.entity';
import { Room } from './entities/rooms.entity';
import { CreateTables1707251681489 } from './migrations/1707251681489-createTables';


const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST,
   port: parseInt(process.env.PGPORT || ''),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   synchronize: false,
   logging: false,
   entities: [ User, Relationship, UserRoom, Room ],
   subscribers: [],
   migrations: [
      CreateTables1707251681489
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
