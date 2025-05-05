import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { CSVLink } from "react-csv";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const TrackerPage = () => {
  const [trips, setTrips] = useState(() => {
    const saved = localStorage.getItem("trips");
    return saved ? JSON.parse(saved) : [{ name: "Default Trip", expenses: [] }];
  });

  const [currentTripIndex, setCurrentTripIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [newTripName, setNewTripName] = useState("");
  const [exchangeRates, setExchangeRates] = useState({});
  const [baseCurrency, setBaseCurrency] = useState("USD");

  // Save trips to localStorage
  useEffect(() => {
    localStorage.setItem("trips", JSON.stringify(trips));
  }, [trips]);

  // Fetch exchange rates
  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
        );
        const data = await res.json();
        setExchangeRates(data.rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      }
    };
    fetchRates();
  }, [baseCurrency]);

  const addExpense = () => {
    if (!description || !amount || !category) return;
    const newExpense = { description, amount: parseFloat(amount), category };
    const updatedTrips = [...trips];
    updatedTrips[currentTripIndex].expenses.push(newExpense);
    setTrips(updatedTrips);
    setDescription("");
    setAmount("");
    setCategory("");
  };

  const deleteExpense = (indexToRemove) => {
    const updatedTrips = [...trips];
    updatedTrips[currentTripIndex].expenses = updatedTrips[
      currentTripIndex
    ].expenses.filter((_, i) => i !== indexToRemove);
    setTrips(updatedTrips);
  };

  const addTrip = () => {
    if (!newTripName.trim()) return;
    setTrips([...trips, { name: newTripName, expenses: [] }]);
    setNewTripName("");
    setCurrentTripIndex(trips.length);
  };

  const currentExpenses = trips[currentTripIndex]?.expenses || [];
  const total = currentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const categoryTotals = currentExpenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
    name,
    value,
  }));

  const headers = [
    { label: "Description", key: "description" },
    { label: "Amount", key: "amount" },
    { label: "Category", key: "category" },
  ];

  const exportPDF = () => {
    const chart = document.getElementById("chart-container");
    if (!chart) return;
    html2canvas(chart).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "PNG", 10, 10);
      pdf.save(`${trips[currentTripIndex]?.name || "trip"}-expenses.pdf`);
    });
  };

  useEffect(() => {
    const savedTrips = localStorage.getItem("trips");
    try {
      const parsedTrips = savedTrips ? JSON.parse(savedTrips) : null;
      if (Array.isArray(parsedTrips) && parsedTrips.length > 0) {
        setTrips(parsedTrips);
      } else {
        setTrips([{ name: "Default Trip", expenses: [] }]);
      }
    } catch (e) {
      console.warn("Clearing corrupted localStorage");
      localStorage.removeItem("trips");
      setTrips([{ name: "Default Trip", expenses: [] }]);
    }
  }, []);

  const convertAmount = (amount, currency = baseCurrency) => {
    if (
      !exchangeRates ||
      !exchangeRates[currency] ||
      !exchangeRates[baseCurrency]
    )
      return amount;
    return (amount / exchangeRates[currency]) * exchangeRates[baseCurrency];
  };

  return (
    <div className="p-6 max-w-2xl mx-auto mt-10 border rounded-lg shadow bg-white">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Travel Expense Tracker
      </h1>

      {/* Trip Select */}
      <div className="mb-4">
        <select
          value={currentTripIndex}
          onChange={(e) => setCurrentTripIndex(parseInt(e.target.value))}
          className="w-full p-2 border rounded mb-2"
        >
          {trips.map((trip, idx) => (
            <option key={idx} value={idx}>
              {trip.name}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <input
            value={newTripName}
            onChange={(e) => setNewTripName(e.target.value)}
            placeholder="New Trip Name"
            className="flex-grow p-2 border rounded"
          />
          <button
            onClick={addTrip}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add Trip
          </button>
        </div>
      </div>

      {/* Expense Form */}
      <div className="mb-6 space-y-2">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          type="number"
          className="w-full p-2 border rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Lodging">Lodging</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Other">Other</option>
        </select>
        <button
          onClick={addExpense}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </div>

      {/* Currency Selector */}
      <div className="mb-4">
        <label className="font-semibold block mb-1">Base Currency</label>
        <select
          value={baseCurrency}
          onChange={(e) => setBaseCurrency(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="INR">INR</option>
          <option value="GBP">GBP</option>
        </select>
      </div>

      {/* Expense List */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        {currentExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet.</p>
        ) : (
          <ul className="space-y-2">
            {currentExpenses.map((exp, idx) => (
              <li
                key={idx}
                className="bg-gray-100 p-2 rounded flex justify-between items-center"
              >
                <div>
                  <span>
                    {exp.description} ({exp.category})
                  </span>{" "}
                  — ${exp.amount.toFixed(2)}
                </div>
                <button
                  onClick={() => deleteExpense(idx)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Category Totals */}
      {Object.keys(categoryTotals).length > 0 && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Category Summary</h3>
          <ul className="list-disc pl-6 text-sm">
            {Object.entries(categoryTotals).map(([cat, amt]) => (
              <li key={cat}>
                {cat}: ${amt.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Pie Chart */}
      {pieData.length > 0 && (
        <div className="mb-6" id="chart-container">
          <h3 className="text-lg font-semibold mb-2">Expense Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Export Buttons */}
      <div className="flex gap-4 mb-4">
        <CSVLink
          data={currentExpenses}
          headers={headers}
          filename={`${trips[currentTripIndex]?.name || "trip"}-expenses.csv`}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Export CSV
        </CSVLink>
        <button
          onClick={exportPDF}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Export PDF
        </button>
      </div>

      {/* Total */}
      <div className="text-lg font-semibold text-center">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default TrackerPage;
