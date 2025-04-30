import React, { useState } from "react";

const TripPlannerPage = () => {
  const [trips, setTrips] = useState([]);
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const addTrip = () => {
    if (!location || !startDate || !endDate) return;
    setTrips([...trips, { location, startDate, endDate }]);
    setLocation("");
    setStartDate("");
    setEndDate("");
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
      <ul className="space-y-2">
        {trips.map((trip, index) => (
          <li key={index} className="bg-gray-100 p-3 rounded shadow-sm">
            <div className="font-medium">{trip.location}</div>
            <div className="text-sm text-gray-600">
              {trip.startDate} → {trip.endDate}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripPlannerPage;
