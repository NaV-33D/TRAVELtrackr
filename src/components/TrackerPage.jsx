import React, { useState } from "react";

const TrackerPage = () => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!description || !amount) return;
    setExpenses([...expenses, { description, amount: parseFloat(amount) }]);
    setDescription("");
    setAmount("");
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="p-6 max-w-xl mx-auto mt-10 border rounded-lg shadow-md bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">Travel Expense Tracker</h1>
      <div className="mb-4 space-y-4">
        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          placeholder="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={addExpense}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Expense
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Expenses</h2>
        <ul className="space-y-2">
          {expenses.map((exp, index) => (
            <li
              key={index}
              className="bg-gray-100 rounded p-2 flex justify-between"
            >
              <span>{exp.description}</span>
              <span>${exp.amount.toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="text-lg font-medium">
        Total: <span className="font-bold">${total.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default TrackerPage;
