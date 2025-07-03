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
    setNewExpense({ title: '', amount: '', category: '' });
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔙 Dashboard Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-xl font-bold mb-4">📄 Your Expenses</h2>

      <form className="mb-6 space-y-2" onSubmit={handleAddExpense}>
        <input
          type="text"
          placeholder="Title"
          value={newExpense.title}
          onChange={e => setNewExpense({ ...newExpense, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={newExpense.category}
          onChange={e => setNewExpense({ ...newExpense, category: e.target.value })}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
  type="date"
  value={newExpense.date}
  onChange={e => setNewExpense({ ...newExpense, date: e.target.value })}
  className="w-full px-4 py-2 border rounded"
  required
/>

        <button
          type="submit"
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Expense
        </button>
      </form>

      <ul className="space-y-2">
        {expenses.map((exp, idx) => (
          <li key={idx} className="border p-3 bg-white rounded shadow">
            <strong>{exp.title}</strong> – ₹{exp.amount} ({exp.category})
          </li>
        ))}
      </ul>
    </div>
  );
}
