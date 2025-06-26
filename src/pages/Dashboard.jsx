import React, { useEffect, useState } from "react";
import ExpenseChart from "../components/ExpenseChart";
import YearlyChart from "../components/YearlyChart";

const Dashboard = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/dashboard/monthly", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([month, amount]) => ({
          month,
          amount,
        }));
        setMonthlyData(formatted);
      });

    fetch("http://localhost:8080/api/dashboard/yearly", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        const formatted = Object.entries(data).map(([year, amount]) => ({
          year,
          amount,
        }));
        setYearlyData(formatted);
      });
  }, []);

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">📅 Monthly Expenses</h2>
      <ExpenseChart data={monthlyData} />
      
      <h2 className="text-2xl font-bold">📈 Yearly Expenses</h2>
      <YearlyChart data={yearlyData} />
    </div>
  );
};

export default Dashboard;
