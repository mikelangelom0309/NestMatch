// import express from "express"
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
require(`dotenv`).config(); // Can access env file
const schema = require(`./schema.js`); // Can access schema.js
const { connectDatabase } = require(`./database/connections.js`) // Can connect to database
//await connectDatabase(); // Module.exports says the connectDatabase function is accessible everywhere

const root = {
    getAllHomes() {
        return [
            {
                id: 1,
                address: "123 Main St",
                price: 250000,
                bedrooms: 3,
                bathrooms: 2,
                sqft: 1500,
                city: "Gainesville",
                description: "Nice home with backyard"
            }
        ]
    },
};

const app = express()

app.all(
    "/graphql",
    createHandler({
        schema: schema,
        rootValue: root,
        graphiql: true,
    }),
);

async function startServer() {
    await connectDatabase(); // Connect to the database before starting the server
    console.log(`Database connected successfully`);

    app.listen(5001, () => {
        console.log("Server started on PORT: 5001")
    }); // Listen on a Port
}

startServer();


