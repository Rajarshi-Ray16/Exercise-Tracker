const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const HistorySchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address.']
    },
    history: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = History = mongoose.model("Histories", HistorySchema);