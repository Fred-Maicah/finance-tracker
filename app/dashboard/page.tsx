"use client";

import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import Navbar from "@/components/Navbar";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

type Transaction = {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  date: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [user, setUser] = useState<any>(null);

  const [type, setType] = useState("income");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Food");

  // ✅ GET TRANSACTIONS FROM COOKIE
  const fetchTransactions = async () => {
    try {
      const res = await fetch("/api/transactions", { method: "GET" });
      const data = await res.json();
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
  // Fetch transactions (your existing function)
  fetchTransactions();

  // ✅ Fetch user for greeting
  fetch("/api/profile", {
    credentials: "include",
  })
    .then((res) => res.json())
    .then((data) => setUser(data.user))
    .catch((err) => console.error("Failed to fetch user:", err));

}, []);

  // ✅ ADD TRANSACTION
  const handleAdd = async () => {
    try {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: Number(amount),
          description,
          category,
        }),
      });

      // 🔄 RELOAD TRANSACTIONS
      fetchTransactions();

      // reset form
      setAmount("");
      setDescription("");
    } catch (error) {
      console.error("Failed to add transaction:", error);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((a, t) => a + t.amount, 0);

  const monthlyData: { [key: string]: number } = {};
  transactions.forEach((t) => {
    const month = new Date(t.date).toLocaleString("default", { month: "short" });
    if (!monthlyData[month]) monthlyData[month] = 0;
    monthlyData[month] += t.amount;
  });

  const barData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Monthly Spending",
        data: Object.values(monthlyData),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((a, t) => a + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#16a34a", "#dc2626"],
      },
    ],
  };

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good morning" :
    hour < 18 ? "Good afternoon" :
    "Good evening";


  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-6">  

        <h1 className="text-3xl font-bold text-gray-800">
            {greeting}, {user?.name || "User"} 👋
        </h1>


        {/* ADD TRANSACTION */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold">Add Transaction</h2>

          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option>Food</option>
            <option>Nepa Bill</option>
            <option>Transport</option>
            <option>Salary</option>
            <option>House Rent</option>
            <option>Gas, Fuel, Water Bill</option>
            <option>Data Subscription</option>
            <option>Clothing</option>
          </select>

          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-4 py-2 rounded w-full hover:bg-indigo-700 transition"
          >
            Add Transaction
          </button>
        </div>

        {/* SUMMARY */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p>Total Balance</p>
            <h2 className="text-2xl font-bold">₦{balance}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <h2 className="font-semibold mb-4">Monthly Analytics</h2>
            <Bar data={barData} />
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p>Income</p>
            <h2 className="text-green-600 font-bold">₦{totalIncome}</h2>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
            <p>Expenses</p>
            <h2 className="text-red-600 font-bold">₦{totalExpense}</h2>
          </div>
        </div>

        {/* CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold mb-4">Spending Overview</h2>
          <div className="w-40 h-40 mx-auto">
           <Doughnut
            data={chartData}
            options={{ maintainAspectRatio: false }}
           />
          </div>
        </div>

        {/* TRANSACTIONS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition">
          <h2 className="font-semibold mb-4">Recent Transactions</h2>

          {transactions.length === 0 ? (
            <p className="text-gray-500 text-center">No transactions yet</p>
          ) : (
            <ul className="divide-y">
              {transactions.map((t) => (
                <li key={t._id} className="py-3 flex justify-between">
                  <div>
                    <p>{t.description || "Transaction"}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={
                      t.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }
                  >
                    {t.type === "income" ? "+" : "-"}₦{t.amount}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
