import React, { useEffect, useState } from "react";
import api from "@/api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAuth } from "@clerk/clerk-react";

const COLORS = ["#10B981", "#EF4444"]; // Green for income, Red for expense

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState({
    totalIncome: 0,
    totalExpense: 0,
    totalBalance: 0,
  });

  const { getToken } = useAuth();

  console.log("✅ Dashboard component loaded");

  const fetchInsights = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }

      const res = await api.get("/users/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data) {
        setInsights({
          totalIncome: parseFloat(res.data.totalIncome),
          totalExpense: parseFloat(res.data.totalExpense),
          totalBalance: parseFloat(res.data.totalBalance),
        });
      } else {
        throw new Error("Aucune donnée reçue.");
      }
    } catch (err) {
      console.error("❌ Erreur dashboard:", err.message);
      setError("Erreur lors du chargement des données.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const pieData = [
    { name: "Revenus", value: insights.totalIncome },
    { name: "Dépenses", value: insights.totalExpense },
  ];

  const barData = [
    {
      name: "Ce mois-ci",
      Revenus: insights.totalIncome,
      Dépenses: insights.totalExpense,
    },
  ];

  if (loading) return <div className="p-6 text-center">Chargement...</div>;
  if (error) return <div className="text-red-500 p-6">{error}</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">📊 Tableau de bord</h1>
        <label className="flex cursor-pointer gap-2 items-center">
          <span className="text-sm">🌙</span>
          <input
            type="checkbox"
            className="toggle"
            onChange={() => {
              const html = document.querySelector("html");
              html.setAttribute(
                "data-theme",
                html.getAttribute("data-theme") === "light" ? "dark" : "light"
              );
            }}
          />
          <span className="text-sm">🌞</span>
        </label>
      </div>

      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="flex justify-center items-center bg-base-200 p-4 rounded-xl shadow">
          <div className="bg-blue-100 text-blue-900 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">💰 Solde</h2>
            <p className="text-2xl ml-[10px]">
              {insights.totalBalance.toFixed(2)} MAD
            </p>
          </div>
        </div>
        <div className="flex justify-around items-center bg-base-200 p-4 rounded-xl shadow mt-[50px]">
          <div className="bg-green-100 text-green-900 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">⬆️ Revenus</h2>
            <p className="text-2xl">{insights.totalIncome.toFixed(2)} MAD</p>
          </div>
          <div className="bg-red-100 text-red-900 p-4 rounded-xl shadow">
            <h2 className="text-lg font-semibold">⬇️ Dépenses</h2>
            <p className="text-2xl">{insights.totalExpense.toFixed(2)} MAD</p>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Camembert */}
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Répartition</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Barres */}
        <div className="bg-base-200 p-4 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Comparatif</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={barData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Revenus" fill="#10B981" />
              <Bar dataKey="Dépenses" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
