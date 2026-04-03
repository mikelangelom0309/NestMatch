import { gql } from '@apollo/client';

export const ADD_USER = gql`
    mutation AddUser($name: String!, $email: String!) {
        addUser(name: $name, email: $email) {
            id
            name
            email
        }
    }
`;

export const SAVE_HOME = gql`
    mutation SaveHome($userId: ID!, $homeId: ID!) {
        saveHome(userId: $userId, homeId: $homeId) {
            id
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
            }
        }
    }
`;

export const UPDATE_USER_NAME = gql`
  mutation UpdateUserName($userId: ID!, $name: String!) {
    updateUserName(userId: $userId, name: $name) {
      id
      name
    }
  }
`;

export const UPDATE_USER_EMAIL = gql`
  mutation UpdateUserEmail($userId: ID!, $email: String!) {
    updateUserEmail(userId: $userId, email: $email) {
      id
      email
    }
  }
`;