require('dotenv').config();
import MemoryStore from './memoryStore';
import MongoStore from './mongoStore';

export default process.env.MONGO_INITDB_ROOT_USERNAME ? new MongoStore() : new MemoryStore();

