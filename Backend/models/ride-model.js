const mongoose = require('mongoose');
const rideschema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    captain: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'captain',
    },
    pickup: {
        type: String,
        required: true
    },
    drop: {
        type: String,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'],
        default: 'pending'
    },
    duration: {
        type: Number,
    },
    distance: {
        type: Number
    },
    paymentid: {
        type: String
    },
    orderid: {
        type: String
    },
    signature: {
        type: String
    },
    otp: {
        type: String,
        select: false,
        required: true
    },
    distance: {
        type: Number
    },
    completedAt: {
        type: Date,
        default: null,
        expires: 60 * 60 * 24 * 2
    }
}, { timestamps: true });

// Compound indexes for ultra-fast active ride lookups and trip history
rideschema.index({ user: 1, status: 1 });
rideschema.index({ captain: 1, status: 1 });
rideschema.index({ status: 1 });
rideschema.index({ createdAt: -1 });

module.exports = mongoose.model('ride', rideschema);