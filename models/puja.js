const mongoose = require('mongoose');

//SCHEMA SETUP
const pujaSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

module.exports = mongoose.model("Puja", pujaSchema);