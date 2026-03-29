import React, { useState } from 'react';
import { useQuery, gql } from '@apollo/client';

//Tell Apollo what to ask GraphQL backend for
const AI_SEARCH_HOMES = gql`
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
            similarity
        }
    }
`;

//Reusable component for property card
function HomeCard({ home }) {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <span style={styles.propertyType}>{home.propertyType}</span>
                <span style={styles.price}>${home.price}<span style={styles.perMonth}>/mo</span></span>
            </div>
            <h3 style={styles.address}>{home.address}</h3>
            <p style={styles.location}>{home.city}, {home.state}</p>
            <div style={styles.details}>
                <span>🛏 {home.bedrooms} bed</span>
                <span>🛁 {home.bathrooms} bath</span>
                <span>📐 {home.sqft} sqft</span>
            </div>
            {home.similarity && (
                <div style={styles.similarity}>
                    {Math.round(home.similarity * 100)}% match
                </div>
            )}
        </div>
    );
}

//Main HomePage component
function HomePage() {
    const [query, setQuery] = useState('');

    //loading: true while waiting for response, 
    // data: the actual response data, 
    // error: any error that occurred
    const [searchHomes, { loading, data, error}] = useLazyQuery(AI_SEARCH_HOMES);

    //Called when user clicks search button or enter
    function handleSearch() {
        if(!query.trim()) return; // Don't search if query is empty
        searchHomes({ variables: { query } });
    }

    //Search by pressing enter key
    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSearch();
    }

    return (
        <div style={styles.page}>

        {/* Header */}
        <div style ={styles.header}>
            <h1 style={styles.title}>NestMatch</h1>
            <p style={styles.subtitle}>Find your perfect home with AI-power and personalized search</p>
        </div>

        {/* Search bar */}
        <div style={styles.searchBar}>
            <input
                style={styles.searchInput}
                type="text"
                placeholder="Search for homes (e.g. '3 bed house with backyard')"
                value={query}
                onChange={(e) => setQuery(e.target.value)} //Update state as user types
                onKeyDown={handleKeyDown} //Allow search on enter key
            />
            <button
                style={styles.button}
                onClick={handleSearch}
                disabled={loading} //Disable button while loading
            >
                {loading ? 'Searching...' : 'Search'}
            </button>
        </div>

        {/* Error message */}
        {error && (
            <p style={styles.error}>Error: {error.message}</p>
        )}

        {/* Results */}
        {data && data.aiSearchHomes.length > 0 && (
            <div>
                <h2 style={styles.resultsTitle}>
                    Top {data.aiSearchHomes.length} matches for "{query}"
                </h2>
                <div style={styles.resultsGrid}>
                    
            </div>


                
