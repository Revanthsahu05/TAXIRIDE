const axios = require("axios");
const captainmodel = require("../models/captain-model");
module.exports.getlocation = async (address) => {
  const apikey = process.env.MAPS_API_KEY;
  const encodedAddress = encodeURIComponent(address);
  const url = `https://api.maptiler.com/geocoding/${encodedAddress}.json?key=${apikey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.features && data.features.length > 0) {
      const [lon, lat] = data.features[0].geometry.coordinates;
      return { lat, lon };
    } else {
      throw new Error("No matching location found");
    }
  } catch (err) {
    console.error("Error fetching geolocation:", err.message);
    throw err;
  }
};
module.exports.getdistance = async (
  originLat,
  originLong,
  destinationLat,
  destinationLong
) => {
  if (!originLat || !originLong || !destinationLat || !destinationLong) {
    throw new Error("All coordinates are required");
  }
  const apikey = process.env.ORS_API_KEY;
  const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apikey}&start=${originLong},${originLat}&end=${destinationLong},${destinationLat}`;
  
  try {
    const response = await axios.get(url);
    if (
      response.status !== 200 ||
      !response.data.features ||
      response.data.features.length === 0
    ) {
      throw new Error("Error fetching route data");
    }
    const summary = response.data.features[0].properties.summary;
    const distanceKm = Number((summary.distance / 1000).toFixed(2));
    const durationMin = Math.ceil(summary.duration / 39.1);

    return {
      //km,min
      distance: distanceKm,
      duration: durationMin,
    };
  } catch (err) {
    console.error("Error in getdistance:", err.message);
    throw err;
  }
};
module.exports.getsuggest = async (input) => {
  if (!input) {
    throw new Error("Input is required");
  }
  const apikey = process.env.MAPS_API_KEY;
  const encodedInput = encodeURIComponent(input);
  const url = `https://api.maptiler.com/geocoding/${encodedInput}.json?key=${apikey}`;
  try {
    const response = await axios.get(url);
    const data = response.data;
    const suggestions = response.data.features.map((feature) => ({
      name: feature.text,
      address: feature.place_name,
      coordinates: feature.geometry.coordinates,
    }));
    return suggestions;
  } catch (err) {
    console.error("Error in getsuggest:", err.message);
  }
};
module.exports.getcaptaininradius = async (
  ltd,
  lng,
  radius,
  requiredVehicleType
) => {
  const formattedVehicleType =
    requiredVehicleType.charAt(0).toUpperCase() +
    requiredVehicleType.slice(1).toLowerCase();
  // console.log(formattedVehicleType);
  const captains = await captainmodel.find({
    status: "active",
    "vechile.vechiletype": formattedVehicleType,
    location: {
      $geoWithin: {
        $centerSphere: [[ltd, lng], radius / 6371], // radius in kilometers
      },
    },
  });
  // console.log("captains in radius", captains);
  return captains;
};
