import { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function RideCompletedPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;
  const [rating, setRating] = useState(0);

  const goHome = () => {
    navigate("/home");
  };

  const submitRating = async () => {
    if (rating === 0) return alert("Please select a rating!");
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/rate-captain`,
        { rideid: ride._id, rating }
      );
      alert("Thanks for your feedback!");
      navigate("/home");
    } catch (error) {
      console.log(error);
      alert("Error submitting rating");
    }
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

        <div className="flex flex-col items-center justify-center gap-4 mt-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl cursor-pointer ri-star-${star <= rating ? "fill" : "line"} text-yellow-500`}
              ></i>
            ))}
          </div>
          <button
            onClick={submitRating}
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full transition-all duration-200"
          >
            Submit Rating
          </button>
        </div>

        <div className="mt-6">
          <button
            onClick={goHome}
            className="px-6 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded-full transition-all duration-200"
          >
            Skip & Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default RideCompletedPage;
