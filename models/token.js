const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const tokenSchema = new Schema(
    {
        token: {
            type: String,
            required: true,
        },
        userId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "users",
        },
        
    },
    { timestamps: true }
);


module.exports = mongoose.model("Token", tokenSchema);