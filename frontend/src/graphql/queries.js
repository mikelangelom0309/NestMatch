//Store GraphQL queries
import { gql } from "@apollo/client";

export const AI_SEARCH_HOMES = gql`
    query AiSearchHomes($query: String!) {
        aiSearchHomes(query: $query) {
            id
            address
            city
            state
            price
            bedrooms
            bathrooms
            sqft
            propertyType
            propertyURL
            similarity
        }
    }
`;

export const GET_HOMES = gql`
    query GetHomes {
        getAllHomes {
            id
            address
            price
            bedrooms
            bathrooms
        }
    }
`;

export const SEARCH_HOMES = gql`
    query SearchHomes($query: String!) {
        searchHomes(query: $query) {
            id
            address
            price
        }
    }
`; 

export const GET_USER = gql`
    query GetUser($id: ID!) {
        getUser(id: $id) {
            id
            name
            email
            savedHomes {
                id
                address
                city
                state
                price
                bedrooms
                bathrooms
                sqft
                propertyType
                propertyURL
            }
        }
    }
`;