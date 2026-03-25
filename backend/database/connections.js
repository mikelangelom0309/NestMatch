const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDatabase() {
    if (!client) {
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://mikelangelom0309_db_user:YayoYaya2113@nestmatch.meuxx7w.mongodb.net/?appName=NestMatch";  // Add tls=true explicitly
        
        client = new MongoClient(mongoURI);

        await client.connect(); // Connect to the database
        console.log("Connected to MongoDB");

        // Get database
        db = client.db(process.env.DB_NAME || "test");
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