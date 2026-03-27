const express = require("express");
const { buildSchema } = require("graphql");
require(`dotenv`).config(); // Can access env file
const schema = require(`./schema.js`); // Can access schema.js

const { connectDatabase } = require(`./database/connections.js`)
//await connectDatabase(); // Module.exports says the connectDatabase function is accessible everywhere
const { ApolloServer } = require("apollo-server-express");
const { authenticateToken } = require("./utils/auth");
const { generateEmbedding } = require("./embeddingModel");

const Home = require("./models/home.js");
const User = require("./models/user.js");

const app = express();
app.use(express.json()); // Middleware to parse JSON request bodies

function cosineSimilarity(vecA, vecB) { // Function to calculate cosine similarity between two vectors for embedding-based search
    if(!vecA || !vecB || vecA.length !== vecB.length) {
        return -1;
    }
    let dot = 0;
    let magA = 0;
    let magB = 0;

    for(let i = 0; i < vecA.length; i++) {
        dot += vecA[i] * vecB[i];
        magA += vecA[i] * vecA[i];
        magB += vecB[i] * vecB[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    if(magA === 0 || magB === 0) {
        return -1;
    }

    return dot / (magA * magB);
}

const root = {
   async getAllHomes() {
    return await Home.find(); // Return all homes from the database
   },

   async getHome({id}) {
    return await Home.findById(id); // Return a specific home by ID from the database
   },

   async searchHomes({query}) {
    const db = getDB();
    return await db.collection("homes").find({
        description: { $regex: query, $options: "i" } // Case-insensitive search in the description field
     }).toArray();
   },

   async aiSearchHomes({query}) {
    const rawEmbedding = await generateEmbedding(query); // Generate embedding for the search query using the Python script
    
    //Handle possible 2D / 1D embeddings
    const queryEmbedding = rawEmbedding[0]?.length ? rawEmbedding[0] : rawEmbedding; // Use the first element if it's a 2D array, otherwise use the raw embedding
    const homes = await Home.find(); // Fetch all homes from the database
    const homesWithSimilarity = []; // Array to store homes along with their similarity scores

    for(let i = 0; i < homes.length; i++) {
        const home = homes[i];
        if(!home.embedding) {
            continue; // Skip homes that don't have an embedding
        }
        const similarity = cosineSimilarity(queryEmbedding, home.embedding); // Calculate cosine similarity between query embedding and home's embedding
        const homeObj = home.toObject(); // Convert MongoDB document to plain JavaScript object
        homeObj.similarity = similarity; // Add similarity score to the home object
        homesWithSimilarity.push(homeObj); // Add the home object with similarity score to the array
    }

    homesWithSimilarity.sort((a, b) => {
        return b.similarity - a.similarity
    }); // Sort homes by similarity score descending order (highest first)

    const topHomes = homesWithSimilarity.slice(0, 20); // Return the top 20 most similar homes
    return topHomes;
    },

   async getUser({id}) {
    const user = await User.findOne({id});
    return user;
    },

    async addUser({ name, email }) {
        const user = new User({ name, email });
        await user.save();
        return user;
    },

    async saveHome({userId, homeId}) {
        const user = await User.findOne({ id: userId }); // Find user by ID
        if (!user) {
            throw new Error(`User not found`);
        }
        const home = await Home.findById(homeId); // Find home by ID
        if (!home) {
            throw new Error(`Home not found`);
        }

        user.savedHomes.push(home._id); // Add home ID to user's savedHomes array
        await user.save(); // Save the updated user document
        return user; // Return the updated user
    },
};
//module.exports = root; // Export the root resolver functions

//Apollo Server setup with schema and resolvers
const server = new ApolloServer({
    schema,
    rootValue: root,
    introspection: true, // Enable GraphQL introspection for dev
    playground: true, // Enable GraphQL Playground for testing queries
});

async function startServer() {
  try {
    await connectDatabase();  // Wait for MongoDB connection
    console.log("Database connected successfully");

    // Start Apollo Server
    await server.start();  // Start the server asynchronously

    // Apply Apollo Server middleware to Express app
    server.applyMiddleware({ app, path: "/graphql" });

    // Start Express server
    app.listen(5001, () => {
      console.log("Server started on PORT: 5001");
      console.log("GraphQL endpoint available at http://localhost:5001/graphql");
    });
  } catch (error) {
    console.error("Error starting server:", error); // Handle any errors during server startup
  }
}

startServer();


