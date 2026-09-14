import mongoose from 'mongoose';
import dns from 'dns';

// Force DNS resolution order to IPv4 first
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

// Known direct replica set nodes for Dropzen Atlas cluster (bypasses all ISP querySrv ECONNREFUSED failures)
const DIRECT_ATLAS_REPLICA_SET_URI = 'mongodb://mahadevtanti191_db_user:Tqyz7kpMdYQ68uJQ@ac-heuibuu-shard-00-00.arcmqtz.mongodb.net:27017,ac-heuibuu-shard-00-01.arcmqtz.mongodb.net:27017,ac-heuibuu-shard-00-02.arcmqtz.mongodb.net:27017/dropzen?ssl=true&replicaSet=atlas-5xjoe3-shard-0&authSource=admin&retryWrites=true&w=majority';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectWithUri(uri, opts) {
  return mongoose.connect(uri, opts);
}

async function dbConnect() {
  const configuredUri = process.env.MONGODB_URI || DIRECT_ATLAS_REPLICA_SET_URI;

  // 1. Re-use existing live Mongoose connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (cached.conn && cached.conn.connection && cached.conn.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: true, // Allow commands to buffer during connection handshake
      serverSelectionTimeoutMS: 8000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 1,
      family: 4, // Force IPv4
    };

    // Attempt connection with primary URI
    cached.promise = connectWithUri(configuredUri, opts)
      .then((instance) => {
        console.log('✅ Connected to MongoDB successfully.');
        return instance;
      })
      .catch(async (primaryError) => {
        console.warn(`⚠️ Primary MongoDB connection failed (${primaryError.message}). Trying permanent direct replica set fallback...`);
        cached.promise = null;

        // If primary failed (e.g. querySrv ECONNREFUSED on mongodb+srv), try direct replica set URI
        if (configuredUri !== DIRECT_ATLAS_REPLICA_SET_URI) {
          try {
            await mongoose.disconnect().catch(() => {});
            const fallbackInstance = await connectWithUri(DIRECT_ATLAS_REPLICA_SET_URI, opts);
            console.log('✅ Successfully connected to MongoDB Atlas via permanent direct replica-set fallback.');
            return fallbackInstance;
          } catch (directError) {
            console.error('❌ Direct Atlas connection also failed:', directError.message);
          }
        }

        // Local dev fallback if in development
        if (process.env.NODE_ENV !== 'production') {
          const localUri = 'mongodb://127.0.0.1:27017/dropzen';
          try {
            await mongoose.disconnect().catch(() => {});
            const localInstance = await connectWithUri(localUri, {
              ...opts,
              serverSelectionTimeoutMS: 3000,
            });
            console.log('✅ Connected to local MongoDB fallback.');
            return localInstance;
          } catch (localError) {}
        }

        throw new Error(`Database connection failed: ${primaryError.message}. Ensure MongoDB Atlas IP Whitelist has 0.0.0.0/0 enabled.`);
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    cached.conn = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
