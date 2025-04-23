const ridemodel=require('../models/ride-model')
const mapservice=require('./maps-services')
const crypto=require('crypto')
let dist=0;
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
    dist = disttime.distance;
    const fare = {
      auto: Math.round(
        (basefare.auto + disttime.distance * perkm.auto + disttime.duration * permin.auto) * 100
      ) / 100,

      car: Math.round(
        (basefare.car + disttime.distance * perkm.car + disttime.duration * permin.car) * 100
      ) / 100,

      motorcycle: Math.round(
        (basefare.motorcycle + disttime.distance * perkm.motorcycle + disttime.duration * permin.motorcycle) * 100
      ) / 100,
    };
    // console.log("fare ",fare)
    return fare;
  } catch (error) {
    console.error("error in getfare", error.message);
    throw error;
  }
}
module.exports.getfare=getfare;
function getotp(num){
    const otp=crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString()
    return otp;
}
module.exports.createride=async({user,pickup,drop,vechiletype})=>{
    if(!user || !pickup || !drop || !vechiletype){
        throw new Error("All fields are required")
    }
    const fare=await getfare(pickup,drop)
    const ride = await ridemodel.create({
      user,
      pickup: pickup,
      drop: drop,
      otp: getotp(6),
      fare: fare[vechiletype],
      distance: Math.round(dist),
    });
    return ride
}

module.exports.confirmride=async(rideid,captainid)=>{
   if(!rideid){
    throw new Error("Ride id is required")
   }
  //  await ridemodel.findOneAndUpdate({_id:rideid},{
  //   status:"accepted",
  //   captain:captainid
  //  })
   const updated = await ridemodel.findOneAndUpdate(
     { _id: rideid, status: "pending" }, // Only update if pending
     { status: "accepted", captain: captainid },
     { new: true } // Return the updated document
   );

   if (!updated) {
     throw new Error("Ride not found or already accepted/cancelled/completed");
   }
   const ride = await ridemodel
     .findOne({ _id: rideid })
     .populate("user").populate("captain").select("+otp")
    //  console.log(ride)
   if(!ride){
    throw new Error("Ride not found")
    }
    return ride;
}
module.exports.startride=async(rideid,otp,captainid)=>{
  if(!rideid || !otp || !captainid){
    throw new Error("All fields are required")
  }
  const ride=await ridemodel.findOne({_id:rideid}).populate('captain').populate('user').select('+otp')
  if(!ride){
    throw new Error("Ride not found")
  }
  if(ride.otp!==otp){
    throw new error("Invalid Otp")
  }
  if(ride.status!=='accepted'){
    throw new Error("Ride already started")
  }
  await ridemodel.findOneAndUpdate({_id:rideid},{
    status:'accepted',
  })
  return ride
}
module.exports.completeride=async(rideid,captainid)=>{
  if(!rideid || !captainid){
    throw new Error("All fields are required")
  }
  const ride=await ridemodel.findOne({_id:rideid}).populate('captain').populate('user')
  if(!ride){
    throw new Error("ride not found")
  }
   await ridemodel.findOneAndUpdate(
     { _id: rideid },
     {
       status: "Completed",
       completedAt: new Date(),
     }
   );
  return ride
}