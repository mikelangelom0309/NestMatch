const mongoose = require('mongoose');

const homeSchema = new mongoose.Schema({ // Home schema (Mongoose model) to interact with database (Saving and querying data)
    id: { type: String, required: true },
    address: {type: String, required: true },
    price: {type: Number, required: true },
    bedrooms: {type: Number, required: true },
    bathrooms: {type: Number, required: true },
    sqft: {type: Number, required: true },
    city: {type: String, required: true },
    state: {type: String, required: true },
    description: {type: String, required: true },

    embedding: {
        type: [Number], // Array of numbers to store the embedding vector
        required: true
    },

    createdAt: { type: Date, default: Date.now }
});

const Home = mongoose.model('Home', homeSchema);
module.exports = Home;