const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({ // User schema (Mongoose model) to interact with database (Saving and querying data)
    // id: { type: String, required: true, unique: true },
    name: {type: String, required: true },
    email: {type: String, required: true, unique: true },
    savedHomes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Home'}], //Array of ObjectIds referencing Home documents
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
module.exports = User;