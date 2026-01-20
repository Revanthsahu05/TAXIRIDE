const mongoose = require('mongoose');

const pendingCaptainSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, 'First name must be at least 3 characters long']
        },
        lastname: {
            type: String,
            minlength: [3, 'Last name must be at least 3 characters long']
        },
    },
    email: {
        type: String,
        required: true,
        unique: true, // Unique in the pending list
        minlength: [5, 'Email must be of length 5']
    },
    password: {
        type: String,
        required: true,
    },
    otpHash: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 600 // Document automatically deleted after 600 seconds (10 minutes)
    }
});

module.exports = mongoose.model('PendingCaptain', pendingCaptainSchema);
