import { DataSource } from 'typeorm';
import 'dotenv/config';
import { User } from './entities/user.entity';
import { Relationship } from './entities/relationship.entity';
import { CreateDatabase1705787530564 } from './migrations/1705787530564-createDatabase';
import { RelationshipTypeAdded1705787763372 } from './migrations/1705787763372-relationshipTypeAdded';
import { ChangeRequesterAndAddresseed1705795354773 } from './migrations/1705795354773-changeRequesterAndAddresseed';

const AppDataSource = new DataSource({
   type: 'postgres',
   host: process.env.DB_HOST,
   port: parseInt(process.env.PGPORT || ''),
   username: process.env.DB_USER,
   password: process.env.DB_PASSWORD,
   database: process.env.DB,
   synchronize: false,
   logging: true,
   entities: [ User, Relationship ],
   subscribers: [],
   migrations: [
      CreateDatabase1705787530564,
      RelationshipTypeAdded1705787763372,
      ChangeRequesterAndAddresseed1705795354773
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
