const mongoose = require('mongoose');
const tweetSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
    },
    tweet: {
        type: String,
        reqired: true,
    },
    comment: {
        type: String,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('tweet', tweetSchema);