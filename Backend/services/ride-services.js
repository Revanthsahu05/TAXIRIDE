const ridemodel=require('../models/ride-model')
const mapservice=require('./maps-services')
const crypto=require('crypto')
async function getfare(pickup, drop) {
  if (!pickup || !drop) {
    throw new Error("Pickup and drop locations are required");
  }
  try {
    const pickupCoords = await mapservice.getlocation(pickup);
    const dropCoords = await mapservice.getlocation(drop);
    const disttime = await mapservice.getdistance(
      pickupCoords.lat,
      pickupCoords.lon,
      dropCoords.lat,
      dropCoords.lon
    );
    // console.log(pickupCoords, dropCoords, disttime);
    const basefare = {
      auto: 30,
      car: 50,
      motorcycle: 10,
    };
    const perkm = {
      auto: 10,
      car: 15,
      motorcycle: 5,
    };
    const permin = {
      auto: 2,
      car: 3,
      motorcycle: 1.5,
    };
    const fare = {
      auto:
        basefare.auto +
        disttime.distance * perkm.auto +
        disttime.duration * permin.auto,
      car:
        basefare.car +
        disttime.distance * perkm.car +
        disttime.duration * permin.car,
      motorcycle:
        basefare.motorcycle +
        disttime.distance * perkm.motorcycle +
        disttime.duration * permin.motorcycle,
    };
    // console.log("fare ",fare)
    return fare;
  } catch (error) {
    console.error("error in getfare", error.message);
    throw error;
  }
}
function getotp(num){
    const otp=crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString()
    return otp;
}
module.exports.createride=async({user,pickup,drop,vechiletype})=>{
    if(!user || !pickup || !drop || !vechiletype){
        throw new Error("All fields are required")
    }
    const fare=await getfare(pickup,drop)
    const ride=await ridemodel.create({
        user,
        pickup:pickup,
        drop:drop,
        otp:getotp(6),
        fare:fare[vechiletype]
    })
    return ride
}
