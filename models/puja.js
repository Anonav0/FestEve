const mongoose = require('mongoose');

//SCHEMA SETUP
const pujaSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String, 
    comments : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref : "Comment"
        }
    ]
});

module.exports = mongoose.model("Puja", pujaSchema);