import React from "react";

const ErrorPage = (props) => {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-100 to-purple-200 px-4">
      <div className="bg-white p-8 shadow-lg rounded-xl max-w-md w-full text-center">
        <div className="text-red-500">
          <i className="ri-map-pin-off-line text-7xl mb-6"></i>
        </div>
        <h1 className="text-3xl font-bold text-red-700 mb-4">
          No Taxis Available
        </h1>
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find any taxis to your selected destination.
        </p>
        <button
          onClick={() => {
            props.setpanel(true);
            props.setvechilepanel(false);
            props.setsuccess("2");
          }}
          className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full font-semibold hover:from-indigo-600 hover:to-purple-700 transition duration-300"
        >
          Go Back Home
        </button>
      </div>
    </div>
  );
};

export default ErrorPage;
