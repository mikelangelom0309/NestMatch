//Store GraphQL queries
import { gql } from "@apollo/client";

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
