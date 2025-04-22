const captainmodel = require("../models/captain-model");
module.exports.createcaptain = async ({
  firstname,
  lastname,
  email,
  password,
  vechiletype,
  color,
  Plate,
  capacity,
}) => {
  if (
    !firstname ||
    !email ||
    !password ||
    !vechiletype ||
    !color ||
    !Plate ||
    !capacity
  ) {
    throw new Error("All fields are required");
  }
  const existscaptain = await captainmodel.findOne({ email });
  if (existscaptain) {
    throw new Error("Captain already exists");
  }
  const captain = await captainmodel.create({
    fullname: {
      firstname,
      lastname,
    },
    email,
    password,
    vechile: {
      color,
      Plate,
      capacity,
      vechiletype,
    },
  });
  const token = await captain.generateAuthToken();
  
  return { captain, token };
};
