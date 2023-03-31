const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

// Create Schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address.']
    },
    password: {
        type: String,
        required: true
    },
    loggedIn: {
        type: Boolean,
        required: true
    },
    dob: {
        type: Date,
        required: true,
    },
    age: {
        type: Number,
        required: false,
        default: 0
    },
    height: {
        type: Number,
        required: true
    },
    weight: {
        type: Number,
        required: true
    },
    physicalIssues: {
        type: Array,
        required: false,
        default: []
    },
    schedule: {
        type: Array,
        required: false,
        default: []
    }
});

module.exports = User = mongoose.model("Users", UserSchema);