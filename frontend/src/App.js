import React from 'react';
import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import client from './graphql/apolloClient';
import HomePage from './pages/HomePage';
import UserProfilePage from './pages/UserProfilePage';

function App() {
    return (
        <ApolloProvider client={client}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/profile/:userId" element={<UserProfilePage />} />
                </Routes>
            </BrowserRouter>
        </ApolloProvider>
    );
}

export default App;
