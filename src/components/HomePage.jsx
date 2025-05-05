import React from "react";
import { Link } from "react-router-dom";
import BlurText from "./BlurText";

const handleAnimationComplete = () => {
  console.log("Animation completed!");
};

const servicesData = [
  {
    title: "Travel Tracking",
    description: "Track your travel expenses and set budgets for your trips.",
    icon: "Traveltracking.png",
  },
  {
    title: "Trip Planning",
    description:
      "Easily plan your trips with detailed itineraries and bookings.",
    icon: "travelplan.webp",
  },
  {
    title: "Destination Guide",
    description: "Explore amazing travel destinations and find the best deals.",
    icon: "destinationguide.png",
  },
];

const packages = [
  {
    title: "Paris Adventure",
    image: "/Paris.jpg",
    description:
      "A romantic getaway to the City of Lights, explore Eiffel Tower and museums.",
    price: "$999",
  },
  {
    title: "Bali Beach Escape",
    image: "/Newyork.jpg",
    description:
      "Relax on the beautiful beaches of Bali, perfect for rejuvenation.",
    price: "$799",
  },
  {
    title: "New York City Tour",
    image: "/Bali.jpg",
    description:
      "Explore iconic landmarks like Times Square, Statue of Liberty, and more.",
    price: "$1299",
  },
];

const HomePage = () => {
  return (
    <>
      <section
        className="bg-cover bg-center min-h-screen flex items-center justify-center text-white px-4 md:px-10 relative m"
        style={{ backgroundImage: "url(/1.png)" }}
      >
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white to-transparent h-32"></div>

        <div className="text-center max-w-3xl z-10">
          <BlurText
            text="Explore the World🌍"
            delay={150}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-5xl mb-4 font-semibold"
          />
          <p className="text-lg md:text-xl mb-6">
            Find your next adventure with TravelTrackr
          </p>
          <div className="space-x-4">
            <Link
              to="/tracker"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-all"
            >
              Start Tracking
            </Link>
            <Link
              to="/planner"
              className="bg-green-600  text-white px-6 py-3 rounded-lg hover:bg-green-800 transition-all"
            >
              Plan a Trip
            </Link>
          </div>
        </div>
      </section>

      <div>
        <section className=" text-black py-16 px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Services</h1>
          <p className="text-lg md:text-xl mb-8">
            We offer a range of services to help make your travel experience
            smoother.
          </p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 py-16 px-4 ">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 text-center hover:shadow-xl transform transition duration-300 hover:scale-105"
            >
              <img
                src={service.icon}
                alt={service.title}
                className="mx-auto mb-6 w-50 h-50 rounded-lg"
              />
              <h3 className="text-2xl font-semibold mb-4">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </section>
      </div>

      <section className="bg-[#ECF1F0] py-16 px-8" id="best-packages">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Best Packages for You
        </h2>
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden shadow-lg transform transition duration-300 hover:scale-105"
            >
              <img
                src={pkg.image}
                alt={pkg.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 bg-gray-50">
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">
                  {pkg.title}
                </h3>
                <p className="text-gray-600 mb-4">{pkg.description}</p>
                <div className="flex justify-between items-center">
                  <p className="text-lg font-bold text-blue-600">{pkg.price}</p>
                  <button className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-emerald-950 text-white py-12 px-6">
        <div className="container mx-auto grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10">
          {/* Logo and description */}
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold text-blue-500 mb-4">
              TravelTrackr
            </h2>
            <p className="text-gray-400 mb-6">
              Your all-in-one travel companion for planning, tracking, and
              exploring new destinations.
            </p>
            <div className="flex justify-center md:justify-start space-x-6">
              <a
                href="https://www.facebook.com"
                className="text-gray-400 hover:text-blue-500 transition duration-300"
              >
                <i className="fab fa-facebook-f"></i>{" "}
                {/* Add Font Awesome icon */}
              </a>
              <a
                href="https://twitter.com"
                className="text-gray-400 hover:text-blue-500 transition duration-300"
              >
                <i className="fab fa-twitter"></i> {/* Add Font Awesome icon */}
              </a>
              <a
                href="https://www.instagram.com"
                className="text-gray-400 hover:text-blue-500 transition duration-300"
              >
                <i className="fab fa-instagram"></i>{" "}
                {/* Add Font Awesome icon */}
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3 text-gray-400">
              <li>
                <a
                  href="/"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/tracker"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Tracker
                </a>
              </li>
              <li>
                <a
                  href="/planner"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Trip Planner
                </a>
              </li>
              <li>
                <a
                  href="/destinations"
                  className="hover:text-blue-500 transition duration-300"
                >
                  Destinations
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-white mb-4">
              Contact Us
            </h3>
            <p className="text-gray-400 mb-3">#58, Despande nagar</p>
            <p className="text-gray-400 mb-3">Hubli, Karnataka, 580028</p>
            <p className="text-gray-400 mb-6">
              Email: support@traveltrackr.com
            </p>
            <p className="text-gray-400">Phone: (123) 456-7890</p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} TravelTrackr. All rights reserved.
            <br />
            made with ❤️ by Naveed.
          </p>
        </div>
      </footer>
    </>
  );
};

export default HomePage;
