import React from 'react'
import "remixicon/fonts/remixicon.css";
const Locationsearchpanel = (props) => {
  // console.log(props);
  const locations = [
    "24B, Near kapoors cafe, Sector 15, Noida",
    "23B , Near kapoors cafe, Sector 15, Noida",
    "22B, Near kapoors cafe, Sector 15, Noida",
    "21B, Near kapoors cafe, Sector 15, Noida",];
  return (
    <div>
      {/* location search panel sample data*/}
      {
        locations.map((location,index) => {
          return (
            <div key={index} onClick={()=>{
              props.setvechilepanel(true)
              props.setpanel(false)
              props.setoverf(true);
              // console.log(props.vechilepanel)
            }} className="flex border-2 p-3 rounded-xl border-gray-50 active:border-black items-center justify-start gap-2 mb-2">
              <h2 className="bg-[#eee] p-2 rounded-full text-xl">
                <i className="ri-map-pin-line"></i>
              </h2> 
              <h2 className="font-medium">{location}</h2>
            </div>
          );
        })
     }
    </div>
  );
}

export default Locationsearchpanel
