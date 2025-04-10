const mapservice=require('../services/maps-services')
const {validationResult}=require('express-validator')
module.exports.getcoordinates=async(req,res,next)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty()){
        return res.status(404).json({errors:errors.array()});
    }
    const address=req.query.address;
    try{
        const coordinates=await mapservice.getlocation(address)
        res.status(200).json(coordinates);
    }catch(error){
        res.status(404).json({message:'coordinates error'})
    }
}
module.exports.getdisttime = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  const origin = req.query.origin;
  const destination = req.query.destination;

  try {
    const originCoords = await mapservice.getlocation(origin);
    const destinationCoords = await mapservice.getlocation(destination);
    const result = await mapservice.getdistance(
      originCoords.lat,
      originCoords.lon,
      destinationCoords.lat,
      destinationCoords.lon
    );
    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getdisttime:", error.message);
    res.status(500).json({ message: "distance/time fetch error" });
  }
};
module.exports.getSuggestions = async function (req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const input = req.query.input;
  try {
    const suggestions = await mapservice.getsuggest(input);
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({ message: "Suggestion error" });
  }
};
