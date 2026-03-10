const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDatabase() {
    if (!client){
        client = new MongoClient(process.env.MONGO_URI, {});
        await client.connect();
        console.log(`Connected to MongoDB`);
        db = client.db(process.env.DB_NAME || `test`); // Database name default to test
    }
    return db;
}

function getDB() {
    if (!db){
        throw new Error(`Database not initialized. Call connect() first`);
    }
    return db;
}

module.exports = {
    connectDatabase,
    getDB,
};