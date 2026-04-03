import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, useNavigate } from 'react-router-dom';
import { GET_USER } from '../graphql/queries';
import { UPDATE_USER_NAME, UPDATE_USER_EMAIL } from '../graphql/mutations';

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
    const { userId } = useParams();
    const navigate = useNavigate();

    const[isEditing, setIsEditing] = React.useState(false);
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { id: userId },
        skip: !userId,
        onCompleted: (data) => {
            if (data?.getUser) {
                setName(data.getUser.name);
                setEmail(data.getUser.email);
            }
        }
    });

    const [updateUserName] = useMutation(UPDATE_USER_NAME);
    const [updateUserEmail] = useMutation(UPDATE_USER_EMAIL);

    const handleSave = async () => {
        try {
            await updateUserName({ variables: { userId, name } });
            await updateUserEmail({ variables: { userId, email } });
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    if (loading) return <div style={styles.centered}><p>Loading profile...</p></div>;
    if (error) return <div style={styles.centered}>Error: {error.message}</div>;
    if (!data?.getUser) return <div style={styles.centered}>User not found.</div>;

    const user = data.getUser;

    return (
        <div style={styles.page}>
            <button onClick={() => navigate('/')} style={styles.backButton}>
                ← Back to Search
            </button>

            <div style={styles.profileHeader}>
                <div style={styles.avatar}>
                    {user.name.charAt(0).toUpperCase()}
                </div>
                
                <div style={styles.infoContainer}>
                    {isEditing ? (
                        <div style={styles.editForm}>
                            <input 
                                style={styles.input} 
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Name"
                            />
                            <input 
                                style={styles.input} 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                            />
                        </div>
                    ) : (
                        <div>
                            <h1 style={styles.name}>{user.name}</h1>
                            <p style={styles.email}>{user.email}</p>
                        </div>
                    )}
                </div>

                <div style={styles.actions}>
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} style={styles.saveButton}>Save</button>
                            <button onClick={() => setIsEditing(false)} style={styles.cancelButton}>Cancel</button>
                        </>
                    ) : (
                        <button onClick={() => setIsEditing(true)} style={styles.editButton}>
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>

            <h2 style={styles.sectionTitle}>
                Saved Homes ({user.savedHomes?.length || 0})
            </h2>

            {user.savedHomes?.length > 0 ? (
                <div style={styles.grid}>
                    {user.savedHomes.map((home) => (
                        <SavedHomeCard key={home.id} home={home} />
                    ))}
                </div>
            ) : (
                <p style={styles.empty}>No saved homes yet.</p>
            )}
        </div>
    );
}

const styles = {
    page: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: 'Arial, sans-serif', background: '#faf0e6', minHeight: '100vh' },
    backButton: { background: 'none', border: 'none', color: '#a50caa', cursor: 'pointer', marginBottom: '20px', fontWeight: 'bold' },
    profileHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', padding: '24px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    avatar: { width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#a50caa', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 'bold' },
    name: { margin: '0 0 4px 0', fontSize: '1.6rem', color: '#1a1a1a' },
    email: { margin: 0, color: '#888', fontSize: '0.95rem' },
    sectionTitle: { fontSize: '1.3rem', color: '#333', marginBottom: '20px' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' },
    card: { backgroundColor: 'white', border: '1px solid #e8e8e8', borderRadius: '12px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    propertyType: { fontSize: '0.75rem', backgroundColor: '#f0f0f0', padding: '3px 8px', borderRadius: '4px', color: '#555' },
    price: { fontSize: '1.2rem', fontWeight: 'bold', color: '#1a1a1a' },
    perMonth: { fontSize: '0.8rem', fontWeight: 'normal', color: '#922b2b' },
    address: { margin: '0 0 4px 0', fontSize: '1rem', color: '#1a1a1a' },
    location: { margin: '0 0 12px 0', color: '#888', fontSize: '0.9rem' },
    details: { display: 'flex', gap: '12px', fontSize: '0.85rem', color: '#555' },
    centered: { textAlign: 'center', marginTop: '100px', fontSize: '1.2rem', color: '#888' },
    empty: { color: '#aaa', textAlign: 'center', marginTop: '40px' },
};

export default UserProfilePage;
    