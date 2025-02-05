const usermodel = require('../models/user-model');

module.exports.createuser = async ({firstname,lastname,password,email}) => {
  if(!firstname || !password || !email){
    throw new Error('All fields are required');
  }
    const existsuser = await usermodel.findOne({email});
    if(existsuser){
      throw new Error('User already exists');
    }
      const user = await usermodel.create({
      fullname: {
        firstname,
        lastname
      },
      email,
      password
    });
    const token = await user.generateAuthToken();
    return {user,token}
}