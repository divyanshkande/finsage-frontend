import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import { filterExpenses } from '../services/expenseService';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4'];

function Dashboard() {
  const navigate = useNavigate();
  const [expenses, setExpenses] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [summary, setSummary] = useState(null);
  

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchExpenses();
    fetchMonthlySummary();
    fetchCategorySummary();
    fetchSummary();
    
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/expenses/all", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setExpenses(data);
    } catch (err) {
      console.error("Error fetching expenses:", err.message);
    }
  };

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      credentials: "include"
    });
    fetchExpenses();
  };

  const fetchMonthlySummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/expenses/summary/monthly", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const transformed = Object.entries(json).map(([month, amount]) => ({ month, amount }));
      setMonthlyData(transformed);
    } catch (err) {
      console.error("Error fetching monthly summary:", err.message);
    }
  };

  const fetchCategorySummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/expenses/summary/category", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const json = await res.json();
      const transformed = Object.entries(json).map(([category, amount]) => ({
        name: category,
        value: amount
      }));
      setCategoryData(transformed);
    } catch (err) {
      console.error("Error fetching category summary:", err.message);
    }
  };

  const fetchSummary = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/expenses/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        credentials: "include"
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Error fetching summary:", err.message);
    }
  };

  

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">

      {/* Header and Navigation Buttons */}
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <div className="space-x-2 mt-2 sm:mt-0">
          <button onClick={() => navigate('/savings')} className="bg-blue-500 text-white px-4 py-2 rounded">Savings</button>
          <button onClick={() => navigate('/events')} className="bg-green-500 text-white px-4 py-2 rounded">Events</button>
          <button onClick={() => navigate('/expenses')} className="bg-purple-500 text-white px-4 py-2 rounded">Expenses</button>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Total Income</p>
            <p className="text-2xl font-bold text-green-600">₹{summary.totalIncome}</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-red-600">₹{summary.totalExpenses}</p>
          </div>
          <div className="bg-white p-4 shadow rounded text-center">
            <p className="text-gray-500">Savings</p>
            <p className="text-2xl font-bold text-blue-600">₹{summary.savings}</p>
          </div>
        </div>
      )}

      {/* Charts Layout - Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded h-[350px]">
          <h3 className="text-xl font-semibold mb-3">📅 Monthly Expenses</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 shadow rounded h-[350px]">
          <h3 className="text-xl font-semibold mb-3">📊 Category-wise Breakdown</h3>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

     
      {/* Expense Table (Full Width at Bottom) */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-2 mt-4">🧾 Expenses</h3>
        <table className="min-w-full bg-white border shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Title</th>
              <th className="py-2 px-4 border">Category</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Date</th>
              <th className="py-2 px-4 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp) => (
              <tr key={exp.id}>
                <td className="py-2 px-4 border">{exp.title}</td>
                <td className="py-2 px-4 border">{exp.category}</td>
                <td className="py-2 px-4 border">₹{exp.amount}</td>
                <td className="py-2 px-4 border">{exp.date}</td>
                <td className="py-2 px-4 border">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteExpense(exp.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Dashboard;
