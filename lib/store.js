require('dotenv').config();
import MemoryStore from './memoryStore';
import MongoStore from './mongoStore';

export default process.env.MONGO_URI ? new MongoStore() : new MemoryStore();

