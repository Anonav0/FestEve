const mongoose = require('mongoose');

//SCHEMA SETUP
const pujaSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    loc: String,
    lat: mongoose.Schema.Types.Decimal128,
    lon : mongoose.Schema.Types.Decimal128,
    author : {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});

module.exports = mongoose.model("Puja", pujaSchema);