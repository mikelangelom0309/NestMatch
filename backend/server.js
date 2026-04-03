const express = require("express");
const { buildSchema } = require("graphql");
require(`dotenv`).config(); // Can access env file
const schema = require(`./schema.js`); // Can access schema.js

const { connectDatabase } = require(`./database/connections.js`)
//await connectDatabase(); // Module.exports says the connectDatabase function is accessible everywhere
const { ApolloServer } = require("apollo-server-express");
const { authenticateToken } = require("./utils/auth");
const { generateEmbedding } = require("./embeddingModel");
const mongoose = require("mongoose");

const Home = require("./models/home.js");
const User = require("./models/user.js");
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:3000" })); // Allow CORS from frontend
app.use(express.json()); // Middleware to parse JSON request bodies

function cosineSimilarity(vecA, vecB) { // Function to calculate cosine similarity between two vectors for embedding-based search
    if(!vecA || !vecB || vecA.length !== vecB.length) {
        return 0;
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
        return 0;
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

async getQueryEmbedding() {
    console.log("=== getQueryEmbedding called ===");
    try {
        console.log("Calling generateEmbedding...");
        const embedding = await generateEmbedding("3 bed house with backyard");
        console.log("Embedding result:", embedding);
        console.log("Type:", typeof embedding);
        const result = `Embedding length: ${embedding.length}, first value: ${embedding[0]}`;
        console.log("Returning:", result);
        return result;
    } catch (error) {
        console.error("CAUGHT ERROR:", error);
        return `Error: ${String(error)}`;
    }
},

async aiSearchHomes({ query }) {
    try {
        const queryEmbedding = await generateEmbedding(query);
        const homes = await Home.find();

        return homes.map(home => {
            const h = home.toObject();
            
            // FIX: Check for 'Embedding' (capital E) if 'embedding' is missing
            const homeVec = h.embedding || h.Embedding;
            const similarity = cosineSimilarity(queryEmbedding, homeVec);

            return {
                id: h._id.toString(),
                address: h.address || h.Address || "No Address",
                city: h.city || h.City || "",
                state: h.state || h.State || "",
                // Ensure numbers are returned, not undefined
                price: h.price || h.Rent || h.Price || 0, 
                bedrooms: h.bedrooms || h.Beds || h.Bedrooms || 0,
                bathrooms: h.bathrooms || h.Baths || h.Bathrooms || 0,
                sqft: h.sqft || h.Sqft || h.SquareFeet || 0,
                propertyType: h.propertyType || h['Property Type'] || h.Type || "House",
                propertyURL: h.propertyURL || h['Property Url'] || h.URL || "",
                similarity: similarity === -1 ? 0 : similarity
            };
        })
        .filter(home => home.similarity > 0)
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5);
    } catch (error) {
        console.error("AI Search Error:", error);
        throw new Error("Search failed");
    }
},

//    async aiSearchHomes({ query }) {
//     try {
//         console.log("=== aiSearchHomes called with query:", query);
        
//         const queryEmbedding = await generateEmbedding(query);
//         console.log("Query embedding length:", queryEmbedding.length);

//         const homes = await Home.find();
//         console.log("Homes found in DB:", homes.length);
        
//         if (homes.length === 0) {
//             console.log("No homes found in database!");
//             return [];
//         }

//         console.log("First home embedding exists?", !!homes[0].embedding);
//         console.log("First home embedding length:", homes[0].embedding?.length);

//         const rankedHomes = homes.map(home => {
//             const similarity = cosineSimilarity(queryEmbedding, home.embedding);
//             return { ...home.toObject(), similarity };
//         }).sort((a, b) => b.similarity - a.similarity).slice(0, 5);

//         console.log("Top result:", rankedHomes[0]?.address, "similarity:", rankedHomes[0]?.similarity);
//         return rankedHomes;

//     } catch (error) {
//         console.error("FULL ERROR in aiSearchHomes:", error); // Now logs the real error
//         throw new Error("Failed to search homes with AI.");
//     }
//     },

   async getUser({id}) {
    return await User.findById(id).populate("savedHomes"); // Return a user by ID and populate their saved homes
    },

    async addUser({ name, email }) {
        const user = new User({ name, email });
        await user.save();
        return user;
    },

    async saveHome({userId, homeId}) {
        const user = await User.findById(userId); // Find user by ID
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

    async removeSavedHome({userId, homeId}) {
        const user = await User.findById(userId); // Find user by ID
        if (!user) throw new Error("User not found");
        user.savedHomes.pull(homeId); // Remove home ID from savedHomes array
        await user.save(); // Save the updated user document
        return await User.findById(userId).populate("savedHomes"); // Return updated user with populated saved homes
    },

    async updateUserName({userId, name }) {
        return await User.findByIdAndUpdate(userId, { name: name }, { new: true }).populate("savedHomes"); // Update user's name and return updated user
    },

    async updateUserEmail({userId, email}) {
        return await User.findByIdAndUpdate(userId, { email: email }, { new: true }).populate("savedHomes");
    }
};

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

    const mongoURI = process.env.MONGO_URI || "mongodb+srv://mikelangelom0309_db_user:YayoYaya2113@nestmatch.meuxx7w.mongodb.net/nestmatch?appName=NestMatch";
    await mongoose.connect(mongoURI, { dbName: "nestmatch" }); // Connect Mongoose to MongoDB with specified database});
    console.log("Mongoose connected successfully");
    
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


