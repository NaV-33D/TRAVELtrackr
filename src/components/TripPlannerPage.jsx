import React, { useState, useEffect } from "react";

const TripPlannerPage = () => {
  const [trips, setTrips] = useState(() => {
    const savedTrips = localStorage.getItem("trips");
    return savedTrips ? JSON.parse(savedTrips) : [];
  });

  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  const addTrip = () => {
    if (!location || !startDate || !endDate) return;
    const newTrip = { location, startDate, endDate };
    setTrips([...trips, newTrip]);
    setLocation("");
    setStartDate("");
    setEndDate("");
  };

  const deleteTrip = (indexToDelete) => {
    const updatedTrips = trips.filter((_, index) => index !== indexToDelete);
    setTrips(updatedTrips);
  };

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 border rounded-lg shadow-md bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Plan a New Trip</h1>
      <div className="space-y-4 mb-6">
        <input
          placeholder="Destination"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addTrip}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Trip
        </button>
      </div>

      <h2 className="text-xl font-semibold mb-3">Your Planned Trips</h2>
      {trips.length === 0 ? (
        <p className="text-gray-500">No trips planned yet.</p>
      ) : (
        <ul className="space-y-2">
          {trips.map((trip, index) => (
            <li
              key={index}
              className="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{trip.location}</div>
                <div className="text-sm text-gray-600">
                  {trip.startDate} {"\u2192"} {trip.endDate}
                </div>
              </div>
              <button
                onClick={() => deleteTrip(index)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TripPlannerPage;
