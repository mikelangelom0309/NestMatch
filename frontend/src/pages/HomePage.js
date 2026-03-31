import React, { useState } from 'react';
import { useLazyQuery, gql } from '@apollo/client';

// Tells Apollo what to ask the GraphQL backend for
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

// Reusable child component — receives one home object as a "prop"
// Props are how parent components pass data down to children
function HomeCard({ home }) {
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
            {home.similarity && (
                <div style={styles.similarity}>
                    {Math.round(home.similarity * 100)}% match
                </div>
            )}
        </div>
    );
}

// Main page component
function HomePage() {
    // useState: stores what the user typed — updates on every keystroke
    const [query, setQuery] = useState('');

    // useLazyQuery: like useQuery but only fires when searchHomes() is called
    const [searchHomes, { loading, data, error }] = useLazyQuery(AI_SEARCH_HOMES);

    function handleSearch() {
        if (!query.trim()) return;
        searchHomes({ variables: { query } });
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSearch();
    }

    return (
        <div style={styles.page}>

            {/* Header */}
            <div style={styles.header}>
                <h1 style={styles.title}>NestMatch</h1>
                <p style={styles.subtitle}>
                    Find your perfect home with AI-powered personalized search
                </p>
            </div>

            {/* Search Bar */}
            <div style={styles.searchContainer}>
                <input
                    style={styles.input}
                    type="text"
                    placeholder="Try '3 bed house with backyard' or 'cheap apartment downtown'"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    style={styles.button}
                    onClick={handleSearch}
                    disabled={loading}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </div>

            {/* Error State */}
            {error && (
                <p style={styles.error}>Error: {error.message}</p>
            )}

            {/* Results */}
            {data && data.aiSearchHomes.length > 0 && (
                <div>
                    <h2 style={styles.resultsTitle}>
                        Top {data.aiSearchHomes.length} matches for "{query}"
                    </h2>
                    {/* Map turns your array of homes into an array of HomeCard components */}
                    <div style={styles.grid}>
                        {data.aiSearchHomes.map((home) => (
                            <HomeCard key={home.id} home={home} />
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {data && data.aiSearchHomes.length === 0 && (
                <p style={styles.empty}>
                    No homes found for "{query}". Try a different search.
                </p>
            )}

            {/* Initial State */}
            {!data && !loading && (
                <p style={styles.hint}>
                    Describe your ideal home above and the best matches will appear here!
                </p>
            )}

        </div>
    );
}

const styles = {
    page: {
        maxWidth: '900px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'Arial, sans-serif',
        background: '#faf0e6',
        minHeight: '100vh',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontSize: '3em',
        margin: '0 0 10px 0',
        color: '#a50caa',
    },
    subtitle: {
        fontSize: '1.1rem',
        color: '#040202',
        margin: 0,
    },
    searchContainer: {
        display: 'flex',
        gap: '10px',
        marginBottom: '40px',
    },
    input: {
        flex: 1,
        padding: '14px 18px',
        fontSize: '1rem',
        border: '2px solid #ddd',
        borderRadius: '8px',
        outline: 'none',
        fontFamily: 'Arial, sans-serif',
    },
    button: {
        padding: '14px 28px',
        fontSize: '1rem',
        backgroundColor: '#a50caa',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
    },
    resultsTitle: {
        fontSize: '1.2rem',
        color: '#333',
        marginBottom: '20px',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '12px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px',
    },
    propertyType: {
        fontSize: '0.75rem',
        backgroundColor: '#f0f0f0',
        padding: '3px 8px',
        borderRadius: '4px',
        color: '#555',
    },
    price: {
        fontSize: '1.2rem',
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    perMonth: {
        fontSize: '0.8rem',
        fontWeight: 'normal',
        color: '#922b2b',
    },
    address: {
        margin: '0 0 4px 0',
        fontSize: '1rem',
        color: '#1a1a1a',
    },
    location: {
        margin: '0 0 12px 0',
        color: '#888',
        fontSize: '0.9rem',
    },
    details: {
        display: 'flex',
        gap: '12px',
        fontSize: '0.85rem',
        color: '#555',
    },
    similarity: {
        marginTop: '12px',
        fontSize: '0.8rem',
        color: '#2a7a2a',
        fontWeight: 'bold',
    },
    error: { color: 'red' },
    empty: { color: '#888', textAlign: 'center', marginTop: '40px' },
    hint: { color: '#aaa', textAlign: 'center', marginTop: '40px', fontSize: '1rem' },
};

export default HomePage;
