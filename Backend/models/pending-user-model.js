const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
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
        unique: true,
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
        expires: 600 // 10 minutes TTL
    }
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
