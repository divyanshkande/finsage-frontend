import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
  });
  const [selectedCategory, setSelectedCategory] = useState("All");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
    fetchCategories();
  }, []);

  const fetchExpenses = async () => {
    const res = await fetch("http://localhost:8080/api/expenses", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setExpenses(data);
    }
  };

  const fetchCategories = async () => {
    const res = await fetch("http://localhost:8080/api/categories", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setCategories(data);
    }
  };

  const addExpense = async () => {
    const res = await fetch("http://localhost:8080/api/expenses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(newExpense),
    });
    if (res.ok) {
      setNewExpense({ title: "", amount: "", category: "", date: "" });
      fetchExpenses();
    } else {
      alert("Failed to add expense");
    }
  };

  const deleteExpense = async (id) => {
    await fetch(`http://localhost:8080/api/expenses/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    fetchExpenses();
  };

  const filteredExpenses =
    selectedCategory === "All"
      ? expenses
      : expenses.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-8">
      {/* 🔙 Back to Dashboard */}
      <button
        onClick={() => navigate("/dashboard")}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Dashboard
      </button>

      {/* ➕ Add Expense Form */}
      <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto space-y-4">
        <h2 className="text-xl font-bold">➕ Add New Expense</h2>
        <input
          type="text"
          placeholder="Title"
          value={newExpense.title}
          onChange={(e) => setNewExpense({ ...newExpense, title: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newExpense.amount}
          onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <select
          value={newExpense.category}
          onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={newExpense.date}
          onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
          className="w-full px-3 py-2 border rounded"
        />
        <button
          onClick={addExpense}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Expense
        </button>
      </div>

      {/* 📂 Filter by Category */}
      <div className="max-w-2xl mx-auto">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border rounded mb-4"
        >
          <option>All</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 📋 Expenses List */}
      <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
        <h3 className="text-xl font-semibold mb-4">📋 Expense History</h3>
        {filteredExpenses.length === 0 ? (
          <p className="text-gray-500">No expenses yet.</p>
        ) : (
          <ul className="space-y-4">
            {filteredExpenses.map((expense) => (
              <li
                key={expense.id}
                className="bg-gray-100 p-4 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{expense.title}</p>
                  <p className="text-sm text-gray-600">
                    ₹{expense.amount} • {expense.category} • {expense.date}
                  </p>
                </div>
                <button
                  onClick={() => deleteExpense(expense.id)}
                  className="text-red-500 hover:underline"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Expenses;
