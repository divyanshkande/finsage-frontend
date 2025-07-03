import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: '',
    amount: '',
    category: '',
    date: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:8080/api/expenses/all', {
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => setExpenses(data));
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:8080/api/expenses/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newExpense),
    });
    setNewExpense({ title: '', amount: '', category: '', date: '' });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-gray-800 mb-6">📄 Your Expenses</h2>

      {/* Add Expense Form */}
      <form
        className="bg-white rounded-xl shadow-md p-6 mb-8 space-y-4"
        onSubmit={handleAddExpense}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={newExpense.title}
            onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newExpense.category}
            onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="date"
            value={newExpense.date}
            onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        <div className="text-right">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            ➕ Add Expense
          </button>
        </div>
      </form>

      {/* Expense List */}
      <div className="space-y-4">
        {expenses.length === 0 ? (
          <p className="text-gray-600">No expenses recorded yet.</p>
        ) : (
          expenses.map((exp, idx) => (
            <div
              key={idx}
              className="bg-white shadow-sm rounded-lg p-4 border-l-4 border-blue-400 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                <p className="text-sm text-gray-500">
                  {exp.category} • {exp.date || "No date"}
                </p>
              </div>
              <p className="text-lg font-bold text-red-600">₹{exp.amount}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
