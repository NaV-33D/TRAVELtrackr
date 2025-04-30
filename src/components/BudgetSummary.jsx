import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const COLORS = ["#4F46E5", "#22C55E", "#E11D48", "#F59E0B", "#0EA5E9"];

const BudgetSummary = ({ data }) => {
  return (
    <div className="p-6 bg-white shadow rounded max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4 text-center">Budget Overview</h2>
      <PieChart width={350} height={300}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          dataKey="amount"
          label={({ name, percent }) =>
            `${name} (${(percent * 100).toFixed(0)}%)`
          }
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend verticalAlign="bottom" height={36} />
      </PieChart>
    </div>
  );
};

export default BudgetSummary;
