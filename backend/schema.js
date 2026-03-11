const { buildSchema } = require('graphql');

const schema = buildSchema (`
    type Home {
        id: ID
        address: String
        price: Int
        bedrooms: Int
        bathrooms: Int
        city: String
        sqft: Int
        description: String
    }

    type Location {
        city: String
        state: String
        zipCode: String
    }

    type User { 
        id: ID
        name: String
        email: String
        savedHomes: [Home]
        createdAt: String
    }

    type Query {
        getAllHomes: [Home]
        getHome(id: ID!): Home
        searchHomes(query: String!): [Home]
        getUser(id: ID!): User        
    }

    type Mutation {
        addUser(name: String!, email: String!): User
        saveHome(userId: ID!, homeId: ID!): User
    }
`);

module.exports = schema;