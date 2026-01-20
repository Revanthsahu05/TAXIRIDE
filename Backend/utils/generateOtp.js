const crypto = require('crypto');

module.exports.generateOtp = () => {
    return crypto.randomInt(100000, 999999).toString();
};
