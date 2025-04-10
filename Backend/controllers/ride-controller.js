const rideservice=require('../services/ride-services')
const {validationResult}=require('express-validator')
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
        return res.status(200).json(ride);
    }catch(error){
        return res.status(404).json({message:'ride creation error'})
    }
}