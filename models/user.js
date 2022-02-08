const mongoose = require('mongoose');
const mgtSchema = new mongoose.Schema({
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
    phone: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    authyId: String,
    role: {
        type: String,
        enum: ["Manager", "tenantAdmin", "User"],
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('roles', mgtSchema);