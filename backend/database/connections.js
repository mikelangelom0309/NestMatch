const { MongoClient } = require("mongodb");

let client;
let db;

async function connectDatabase() {
    if (!client) {
        // Corrected Mongo URI, either use the environment variable or fallback to hardcoded URI
        const mongoURI = process.env.MONGO_URI || "mongodb+srv://mikelangelom0309_db_user:YayoYaya2113@nestmatch.meuxx7w.mongodb.net/?appName=NestMatch";

        // Initialize MongoDB Client with the URI
        client = new MongoClient(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectTimeoutMS: 5000, // Optional: Set a timeout for server selection
            socketTimeoutMS: 45000, // Optional: Set a timeout for socket operations
        });

        await client.connect(); // Connect to the database
        console.log("Connected to MongoDB");

        // Get database
        db = client.db(process.env.DB_NAME || "test"); // Default to 'test' if DB_NAME is not provided
    }

    return db;
}

function getDB() {
    if (!db) {
        throw new Error("Database not initialized. Call connect() first");
    }
    return db;
}

module.exports = {
    connectDatabase,
    getDB,
};