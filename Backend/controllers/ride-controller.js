const rideservice=require('../services/ride-services')
const {validationResult}=require('express-validator')
const mapservice=require('../services/maps-services')
const {sendmessagetosocketid}=require('../socket')
const rideModel = require('../models/ride-model')
module.exports.createride=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    const {pickup,drop,vechiletype}=req.body
    try{
        const ride=await rideservice.createride({
            user:req.user._id,
            pickup:pickup,
            drop:drop,
            vechiletype:vechiletype
        })
        res.status(200).json(ride);
        const coordinates=await mapservice.getlocation(pickup)
        const captaininradius=await mapservice.getcaptaininradius(coordinates.lat,coordinates.lon,10,vechiletype)
        // console.log(vechiletype)
        ride.otp="";
        const rideuser=await rideModel.findById(ride._id).populate('user')//for sending user data to socket
        captaininradius.map(async captain=>{
            const socketid=captain.socketId
            if(socketid){
                sendmessagetosocketid(socketid,{
                    event:'new-ride',
                    data: rideuser
                })
            }
        })
    }catch(error){
        return res.status(404).json({message:'ride creation error'})
    }
}
module.exports.getfare=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    const {pickup,drop}=req.query
    try{
        const fare=await rideservice.getfare(pickup,drop);
        return res.status(200).json(fare);
    }catch(error){
        return res.status(404).json({message:'fare calculation error'})
    }
}
module.exports.confirmride=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideid}=req.body
    try{
        const ride=await rideservice.confirmride(rideid,req.captain._id)
       sendmessagetosocketid(ride.user.socketId, {
         event: "rideconfirmed",
         data: ride,
       });
        res.status(200).json(ride)
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}
module.exports.startride=async(req,res,next)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }
    const {rideid,otp}=req.query;
    try{
        const ride=await rideservice.startride(rideid,otp,req.captain._id)
        sendmessagetosocketid(ride.user.socketId,{
            event:'ridestarted',
            data:ride
        })
        return res.status(200).json(ride)
    }catch(error){
        return res.status(500).json({message:error.message})
    }
}