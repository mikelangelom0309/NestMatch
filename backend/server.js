// import express from "express"
const express = require("express");
const { createHandler } = require("graphql-http/lib/use/express");
const { buildSchema } = require("graphql");
require(`dotenv`).config(); // Can access env file
const { connectDatabase } = require(`./database/connections.js`) // Can connect to database
await connectDatabase(); // Module.exports says the connectDatabase function is accessible everywhere

const schema = buildSchema (`
    type Query
`);

const root = {
    getAllHouses() {
    
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

app.listen(5001, () => {
    console.log("Server started on PORT: 5001")
}); // Listen on a Port


