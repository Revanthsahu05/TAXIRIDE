import { useLocation, useNavigate } from "react-router-dom";

function RideCancelledPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const ride = location.state?.ride;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-yellow-100">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90%] max-w-md text-center">
        <h1 className="text-4xl font-extrabold text-red-600 mb-4 animate-pulse">
          Ride Cancelled by User 😔
        </h1>
        <div className="text-gray-700 text-left mb-6">
          <p>
            <span className="font-semibold">Pickup:</span> {ride?.pickup}
          </p>
          <p>
            <span className="font-semibold">Drop:</span> {ride?.drop}
          </p>
        </div>
        <button
          onClick={() => navigate("/captain-home")}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition-all duration-200"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default RideCancelledPage;
