import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4'];

function Events() {
  const [events, setEvents] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    totalBudget: '',
    categories: [{ name: '', amount: '' }]
  });

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:8080/api/events", {
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: 'include'
    })
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setEvents(sorted);
      });
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...formData.categories];
    updated[index][field] = value;
    setFormData({ ...formData, categories: updated });
  };

  const addCategory = () => {
    setFormData({
      ...formData,
      categories: [...formData.categories, { name: '', amount: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const breakdown = {};
    formData.categories.forEach(cat => {
      if (cat.name && cat.amount) breakdown[cat.name] = parseFloat(cat.amount);
    });

    const payload = {
      title: formData.title,
      date: formData.date,
      totalBudget: parseFloat(formData.totalBudget),
      categoryBreakdown: breakdown
    };

    await fetch("http://localhost:8080/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      credentials: "include",
      body: JSON.stringify(payload)
    });

    window.location.reload();
  };

  const handleDeleteEvent = async (id) => {
    await fetch(`http://localhost:8080/api/events/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      },
      credentials: "include"
    });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* 🔙 Back to Dashboard */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded"
      >
        ← Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold mb-4">🎉 Plan an Event</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8 max-w-xl">
        <input
          type="text"
          placeholder="Event Title"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="date"
          required
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />

        <input
          type="number"
          placeholder="Total Budget"
          required
          value={formData.totalBudget}
          onChange={e => setFormData({ ...formData, totalBudget: e.target.value })}
          className="w-full px-4 py-2 border rounded"
        />

        <h4 className="font-semibold">Category Breakdown:</h4>
        {formData.categories.map((cat, i) => (
          <div key={i} className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Category"
              value={cat.name}
              onChange={e => handleChange(i, 'name', e.target.value)}
              className="px-3 py-2 border rounded"
            />
            <input
              type="number"
              placeholder="Amount"
              value={cat.amount}
              onChange={e => handleChange(i, 'amount', e.target.value)}
              className="px-3 py-2 border rounded"
            />
          </div>
        ))}

        <button type="button" onClick={addCategory} className="px-4 py-2 bg-gray-200 rounded">
          + Add Category
        </button>

        <br />
        <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Save Event
        </button>
      </form>

      <h2 className="text-xl font-bold mb-4">📋 Your Events</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {events.map((ev, idx) => {
          const data = Object.entries(ev.categoryBreakdown).map(([name, value]) => ({ name, value }));
          const totalSpent = data.reduce((sum, d) => sum + d.value, 0);
          const saved = ev.totalBudget - totalSpent;

          return (
            <div key={idx} className="border rounded p-4 shadow bg-white flex flex-col">
              <h3 className="text-lg font-semibold">{ev.title}</h3>
              <p className="text-sm text-gray-600">Date: {ev.date}</p>
              <p>Total Budget: ₹{ev.totalBudget}</p>
              <p>Total Spent: ₹{totalSpent}</p>
              <p className={`font-bold ${saved >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {saved >= 0 ? `🎉 Saved ₹${saved}` : `⚠️ Overspent by ₹${-saved}`}
              </p>

              <div className="mt-4 flex justify-center">
                <PieChart width={300} height={300}>
                  <Pie data={data} dataKey="value" nameKey="name" outerRadius={100} label>
                    {data.map((entry, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>

              <button
                onClick={() => handleDeleteEvent(ev.id)}
                className="mt-4 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete Event
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;
