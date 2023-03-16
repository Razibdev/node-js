const mongoose = require("mongoose");
const validator = require("validator");

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please tell us your name!!!"],
    },
    mobile: {
        type: String,
        required: [true, "Please tell us your mobile number!!!"],
    },
    email: {
        type: String,
        required: [true, "Please provide your email"],
        lowercase: true,
        validate: [validator.isEmail, "Please provide a valid email"],
    },

    message: { type: String },

});

const Contact = mongoose.model("Contact", contactSchema);
module.exports = Contact;
