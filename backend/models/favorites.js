const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({ // Favorite schema (Mongoose model) to interact with database (Saving and querying data)
    userId: { type: String, required: true }, // ID of the user who saved the home
    homeId: { type: String, required: true }, // ID of the home that was saved
    createdAt: { type: Date, default: Date.now } // Timestamp for when the favorite was created
});

module.exports = mongoose.model('Favorite', favoriteSchema);