const mongoose = require('mongoose');
const usersSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        reqired: true,
    },
    password: {
        type: String,
        required: true,
    },
    
}, { timestamps: true });

module.exports = mongoose.model('users', usersSchema);