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
      headers: { Authorization: `Bearer ${token}` },
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
    setFormData({ ...formData, categories: [...formData.categories, { name: '', amount: '' }] });
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
      headers: { Authorization: `Bearer ${token}` },
      credentials: "include"
    });
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      {/* Back Button */}
      <button
        onClick={() => navigate('/dashboard')}
        className="mb-6 text-blue-600 hover:text-blue-800 font-medium"
      >
        ← Back to Dashboard
      </button>

      {/* Title */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">🎉 Plan an Event</h2>

      {/* Event Form */}
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-xl p-6 mb-10 max-w-2xl space-y-4">
        <input
          type="text"
          placeholder="Event Title"
          required
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="input"
        />

        <input
          type="date"
          required
          value={formData.date}
          onChange={e => setFormData({ ...formData, date: e.target.value })}
          className="input"
        />

        <input
          type="number"
          placeholder="Total Budget"
          required
          value={formData.totalBudget}
          onChange={e => setFormData({ ...formData, totalBudget: e.target.value })}
          className="input"
        />

        <div>
          <h4 className="font-semibold text-gray-700">📊 Category Breakdown</h4>
          {formData.categories.map((cat, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-2">
              <input
                type="text"
                placeholder="Category"
                value={cat.name}
                onChange={e => handleChange(i, 'name', e.target.value)}
                className="input"
              />
              <input
                type="number"
                placeholder="Amount"
                value={cat.amount}
                onChange={e => handleChange(i, 'amount', e.target.value)}
                className="input"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addCategory}
            className="mt-2 text-sm px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Category
          </button>
        </div>

        <div className="text-right">
          <button
            type="submit"
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 font-semibold"
          >
            ✅ Save Event
          </button>
        </div>
      </form>

      {/* Event Cards */}
      <h2 className="text-xl font-bold mb-4">📋 Your Events</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((ev, idx) => {
          const data = Object.entries(ev.categoryBreakdown).map(([name, value]) => ({ name, value }));
          const totalSpent = data.reduce((sum, d) => sum + d.value, 0);
          const saved = ev.totalBudget - totalSpent;

          return (
            <div key={idx} className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-400 flex flex-col">
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{ev.title}</h3>
                <p className="text-sm text-gray-500">📅 {ev.date}</p>
              </div>

              <div className="text-sm text-gray-700 mb-2">
                <p>Total Budget: ₹{ev.totalBudget}</p>
                <p>Total Spent: ₹{totalSpent}</p>
                <p className={`font-bold ${saved >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {saved >= 0 ? `🎉 Saved ₹${saved}` : `⚠️ Overspent by ₹${-saved}`}
                </p>
              </div>

              <div className="flex justify-center mt-4">
                <PieChart width={260} height={260}>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={90}
                    label
                  >
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
                className="mt-4 self-end px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                🗑️ Delete Event
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Events;
