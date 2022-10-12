
import { MongoClient } from 'mongodb';
import { mongoDbConfig } from './mongoDbConfig';

export function create() {

  const getDbCtxt = async () => {
    const dbName = "antiGaspiDb";
    const cnxStr = 'mongodb+srv://AdminUser:UjD91xXOCYWtPVrj@cluster0.tadkbeh.mongodb.net/?retryWrites=true&w=majority'
    const client = new MongoClient(cnxStr, mongoDbConfig);
    const connectDb = await client.connect();
    return { /* client,  */db: connectDb.db(dbName) };
  };

  return { getDbCtxt };
}