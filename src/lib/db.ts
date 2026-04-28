// This approach is taken from https://github.com/vercel/next.js/tree/canary/examples/with-mongodb
import { env } from '@/schema/env';
import { MongoClient, ServerApiVersion } from 'mongodb';

const uri = env.MONGODB_URI;
const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const globalWithMongo = global as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
};

if (env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClient) {
    globalWithMongo._mongoClient = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise =
      globalWithMongo._mongoClient.connect();
  }
  client = globalWithMongo._mongoClient;
  clientPromise = globalWithMongo._mongoClientPromise!;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
export { client };

// Fire-and-forget: ensure indexes exist on server startup.
// Idempotent and self-memoizing inside ensureIndexes().
// Lazy import to avoid circular dep (db-indexes imports `client`).
if (typeof window === 'undefined') {
  clientPromise
    .then(() => import('./db-indexes').then((m) => m.ensureIndexes()))
    .catch(() => {
      // Errors are logged inside ensureIndexes; don't crash startup
    });
}
