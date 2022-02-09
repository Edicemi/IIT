const mongoose = require('mongoose');
const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "users",
    },
    twitId: {
        type: mongoose.Types.ObjectId,
        ref: "tweet",
        required: true,
    },
    comment: {
        type: String,
        required: true
    },
    
}, { timestamps: true });

module.exports = mongoose.model('comment', commentSchema);