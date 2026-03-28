import React from 'react';

function HomeCard({ home }) {
    return (
        <div className="home-card">
            <h3>{home.address}</h3>
            <p>Price: ${home.price}</p>
            <p>{home.bedrooms} Bedrooms | {home.bathrooms} Bathrooms</p>
        </div>
    );
}

export default HomeCard;