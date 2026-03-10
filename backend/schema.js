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

    type Query {
        getAllHomes: [Home]
        getHome(id: ID!): Home
        searchHomes(query: String!): [Home]
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
    }

`);

module.exports = schema;