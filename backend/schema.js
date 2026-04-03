const { buildSchema } = require('graphql');

const schema = buildSchema (`
    type Home {
        id: ID
        address: String
        price: Int
        bedrooms: Int
        bathrooms: Float
        city: String
        state: String
        sqft: Int
        description: String
        createdAt: String
        propertyType: String
        propertyURL: String
        similarity: Float
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
        aiSearchHomes(query: String!): [Home]
        getUser(id: ID!): User   
        getQueryEmbedding: String     
    }

    type Mutation {
        addUser(name: String!, email: String!): User
        saveHome(userId: ID!, homeId: ID!): User
        removeSavedHome(userId: ID!, homeId: ID!): User
        updateUserName(userId: ID!, name: String!): User
        updateUserEmail(userId: ID!, email: String!): User
    }
`);

module.exports = schema;