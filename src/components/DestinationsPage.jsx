import React from "react";

const DestinationsPage = () => {
  const destinations = [
    {
      name: "Paris, France",
      image: "/Paris.jpg",
      description:
        "The city of lights with rich history and stunning architecture.",
    },
    {
      name: "Kyoto, Japan",
      image: "/tokyo.jpg",
      description:
        "Peaceful temples, cherry blossoms, and authentic Japanese culture.",
    },
    {
      name: "Cape Town, South Africa",
      image: "/capetown.jpg",
      description: "A mix of beaches, mountains, and vibrant city life.",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Explore Destinations</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {destinations.map((dest, idx) => (
          <div key={idx} className="bg-white rounded shadow-md overflow-hidden">
            <img
              src={dest.image}
              alt={dest.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold">{dest.name}</h2>
              <p className="text-gray-600 mt-2">{dest.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DestinationsPage;
