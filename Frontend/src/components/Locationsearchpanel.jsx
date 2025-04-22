import React from 'react'
import "remixicon/fonts/remixicon.css";
const Locationsearchpanel = (props) => {
  // console.log(props);
   const handleSuggestionClick = (suggestion) => {
        if (props.activefield === "pickup") {
          props.setpickup(suggestion);
        } else if (props.activefield === "destination") {
         props.setdestination(suggestion);
        }
    }
  return (
    <div>
      {/* location search panel sample data*/}
      <button
        onClick={() => {
          props.findtrip();
          props.setsuccess(null);
        }}
        className="bg-gradient-to-r w-full from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-semibold mb-4"
      >
        Find Trip
      </button>
      {props.suggestions.map((item, index) => {
        return (
          <div
            key={index}
            onClick={() => {
              handleSuggestionClick(item.address);
              // will off this panel function and will add a button instead
              //will off this also
              props.setoverf(true);
            }}
            className="flex border-2 p-3 rounded-xl border-gray-50 active:border-black items-center justify-start gap-2 mb-2"
          >
            <h2 className="bg-[#eee] p-2 rounded-full text-xl">
              <i className="ri-map-pin-line text-xl text-red-500 hover:text-red-600 transition-all duration-300 "></i>
            </h2>
            <h2 className="font-medium">{item.address}</h2>
          </div>
        );
      })}
    </div>
  );
}

export default Locationsearchpanel
