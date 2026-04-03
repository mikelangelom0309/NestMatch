import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

// This tells Apollo WHERE your backend server is running
const httpLink = createHttpLink({
  uri: 'http://localhost:5001/graphql', 
});

const client = new ApolloClient({
  link: httpLink,
  cache: new InMemoryCache(),
});

export default client;