import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';

//GraphQL query to get user data (user and saved homes)
const GET_USER = gql'
    query GetUser($id: ID!) {
        user(id: $id) {
            id
            name
            email
            savedHomes {}
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
';

function SavedHomeCard({ home }) {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={styles.propertyType}>{home.propertyType}</span>
                <span style={styles.price}>
                    ${home.price}<span style={styles.perMonth}>/mo</span>
                </span>
            </div>
            <h3 style={styles.address}>{home.address}</h3>
            <p style={styles.location}>{home.city}, {home.state}</p>
            <div style={styles.details}>
                <span>🛏 {home.bedrooms} bed</span>
                <span>🛁 {home.bathrooms} bath</span>
                <span>📐 {home.sqft} sqft</span>
            </div>
        </div>
    );
}

function UserProfilePage() {
    //useParams reads variables from URL
    //If URL is /users/123, then id will be "123"
    const { userId } = useParams();

    //useQuery runs immediately when component loads
    const { loading, error, data } = useQuery(GET_USER, {
        variables: { id: userId }
        skip: !userId // Don't run query if no userId in URL
    });

    if (loading) return <div style={styles.container}><p>Loading... profile</p></div>;
    if (error) return <div style={styles.centered}>Error loading profile. Error:{error.message}</div>;
    if (!data?getUser) return <div style={styles.centered}>User not found.</div>;

    