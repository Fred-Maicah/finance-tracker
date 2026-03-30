"use client";

import { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type Transaction = {
  _id: string;
  type: "income" | "expense";
  amount: number;
  description?: string;
  date: string;
};

export default function DashboardPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [type, setType] = useState<"income" | "expense">("income");
  const [amount, setAmount] = useState<number>(0);
  const [description, setDescription] = useState("");

  const fetchTransactions = async () => {
    const res = await fetch("/api/transactions", { credentials: "include" });
    const data = await res.json();
    if (res.ok) setTransactions(data.transactions);
  };

  const addTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ type, amount, description }),
    });
    const data = await res.json();
    if (res.ok) {
      setTransactions([data.transaction, ...transactions]);
      setAmount(0);
      setDescription("");
    } else alert(data.error);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const chartData = {
    labels: ["Income", "Expenses"],
    datasets: [
      {
        label: "Finance Overview",
        data: [totalIncome, totalExpense],
        backgroundColor: ["#16a34a", "#dc2626"], // green, red
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
        Finance Tracker
      </h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-6 mb-8 text-center">
        <div className="p-6 rounded shadow bg-white">
          <h2 className="font-semibold text-gray-600">Balance</h2>
          <p className="text-2xl font-bold">${balance}</p>
        </div>
        <div className="p-6 rounded shadow bg-white">
          <h2 className="font-semibold text-gray-600">Income</h2>
          <p className="text-2xl font-bold text-green-600">${totalIncome}</p>
        </div>
        <div className="p-6 rounded shadow bg-white">
          <h2 className="font-semibold text-gray-600">Expenses</h2>
          <p className="text-2xl font-bold text-red-600">${totalExpense}</p>
        </div>
      </div>

      {/* Doughnut Chart */}
      <div className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Income vs Expenses</h2>
        <Doughnut data={chartData} />
      </div>

      {/* Add Transaction Form */}
      <form onSubmit={addTransaction} className="mb-8 space-y-3 bg-white p-6 rounded shadow">
        <div className="flex gap-4">
          <select
            value={type}
            onChange={(e) => setType(e.target.value as any)}
            className="border p-2 rounded flex-1"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input
            type="number"
            placeholder="Amount"
            className="border p-2 rounded flex-1"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
          />
        </div>
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="bg-black text-white px-4 py-2 rounded w-full hover:bg-gray-800 transition">
          Add Transaction
        </button>
      </form>

      {/* Transactions List */}
      <div className="bg-white rounded shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Transactions</h2>
        <ul className="divide-y divide-gray-200">
          {transactions.map((t) => (
            <li key={t._id} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium">{t.description || "No description"}</p>
                <p className="text-sm text-gray-500">{new Date(t.date).toLocaleString()}</p>
              </div>
              <span
                className={
                  t.type === "income"
                    ? "text-green-600 font-semibold"
                    : "text-red-600 font-semibold"
                }
              >
                {t.type === "income" ? "+" : "-"}${t.amount}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}