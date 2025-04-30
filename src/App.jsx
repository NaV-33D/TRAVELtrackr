import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import TrackerPage from "./components/TrackerPage";
import TripPlannerPage from "./components/TripPlannerPage";
import DestinationsPage from "./components/DestinationsPage";
// import ProfilePage from "./components/ProfilePage";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/tracker" element={<TrackerPage />} />
        <Route path="/planner" element={<TripPlannerPage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
      </Routes>
      {/* Render Services Page below HomePage */}
    </Router>
  );
}

export default App;
