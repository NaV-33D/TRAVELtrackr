import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide">TravelTrackr</h1>

        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-emerald-300 transition">
            Home
          </Link>
          <Link to="/tracker" className="hover:text-emerald-300 transition">
            Tracker
          </Link>
          <Link to="/planner" className="hover:text-emerald-300 transition">
            Trip Planner
          </Link>
          <Link
            to="/destinations"
            className="hover:text-emerald-300 transition"
          >
            Destinations
          </Link>
        </div>

        <button
          className="md:hidden text-white"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-emerald-800 px-6 py-4 flex flex-col gap-3 text-sm font-medium">
          <Link
            to="/"
            className="hover:text-emerald-300"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/tracker"
            className="hover:text-emerald-300"
            onClick={() => setMenuOpen(false)}
          >
            Tracker
          </Link>
          <Link
            to="/planner"
            className="hover:text-emerald-300"
            onClick={() => setMenuOpen(false)}
          >
            Trip Planner
          </Link>
          <Link
            to="/destinations"
            className="hover:text-emerald-300"
            onClick={() => setMenuOpen(false)}
          >
            Destinations
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
