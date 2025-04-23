import { useLocation, useNavigate } from "react-router-dom";

function RideCompletedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  const goHome = () => {
    navigate("/home");
  };

  const handlePayOnline = () => {
    // Add Razorpay logic or redirect here
    alert("Redirecting to payment gateway...");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-4 animate-bounce">
          🎯 Destination Reached!
        </h1>
        <div className="text-gray-700 text-left mb-6">
          <p>
            <span className="font-semibold">Pickup:</span> {ride?.pickup}
          </p>
          <p>
            <span className="font-semibold">Drop:</span> {ride?.drop}
          </p>
          <p>
            <span className="font-semibold">Fare:</span> ₹{ride?.fare}
          </p>
          {ride?.distance && (
            <p>
              <span className="font-semibold">Distance:</span>{" "}
              {ride?.distance.toFixed(2)} km
            </p>
          )}
          {ride?.duration && (
            <p>
              <span className="font-semibold">Duration:</span>{" "}
              {ride?.duration.toFixed(2)} min
            </p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row justify-center">
          <button
            onClick={goHome}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200"
          >
            🏠 Go Back Home
          </button>
          <button
            onClick={handlePayOnline}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200"
          >
            💳 Pay Online
          </button>
        </div>
      </div>
    </div>
  );
}

export default RideCompletedPage;
