const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")

const userschema=mongoose.Schema({
    fullname:{
        firstname:{
            type:String,
            required:true,
            minlength:[3,'First name must be atleast 3 character long']
        },
        lastname:{
            type:String,
            minlength:[3,'Last name must be atleast 3 character long']
        },
    },
    email:{
        type:String,
        required:true,
        unique:true,
        minlength:[5,'Email must be of length 5']
    },
    password:{
        type:String,
        required:true,
        select:false
    }
})
userschema.methods.generateAccessToken = function () {
    return jwt.sign(
        { _id: this._id, role: 'user' },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

userschema.methods.generateRefreshToken = function () {
    const refreshSecret = process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET + "_refresh");
    return jwt.sign(
        { _id: this._id, role: 'user' },
        refreshSecret,
        { expiresIn: '7d' }
    );
};

userschema.methods.generateAuthToken = function () {
    // Backward compatibility: alias to generateAccessToken
    return this.generateAccessToken();
};
userschema.methods.comparePassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
userschema.statics.hashpassword=async function(password){
    return await bcrypt.hash(password,10)
}
module.exports = mongoose.model('user', userschema);