// import express from "express"
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
require(`dotenv`).config(); // Can access env file
const schema = require(`./schema.js`); // Can access schema.js
const { connectDatabase } = require(`./database/connections.js`) // Can connect to database
//await connectDatabase(); // Module.exports says the connectDatabase function is accessible everywhere
const { ApolloServer } = require("apollo-server-express");

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

   async getUser({id}) {
    const user = await User.findOne({id});
    return user;
    }

    async addUser({name, email}) {
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
module.exports = root; // Export the root resolver functions

const app = express()

const server = new ApolloServer({
    schema,
    rootValue: root,
    introspection: true, // Enable GraphQL introspection for dev
    playground: true, // Enable GraphQL Playground for testing queries
});

server.applyMiddleware({ app, path: "/graphql" }); // Apply Apollo Server middleware to Express app at /graphql endpoint

app.all(
    "/graphql",
    createHandler({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }),
);

async function startServer() {
    try {await connectDatabase(); // Connect to the database before starting the server
    console.log(`Database connected successfully`);

    app.listen(5001, () => {
        console.log("Server started on PORT: 5001");
        console.log(`GraphQL endpoint available at http://localhost:5001/graphql`);
    }); // Listen on a Port
} catch (error) {
    console.error(`Error starting server:`, error);
    }
}

startServer();


