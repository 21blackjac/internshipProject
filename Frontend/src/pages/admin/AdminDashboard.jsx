import { useEffect, useState } from "react";
import api from "@/api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent } from "@/components/ui/card";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalBalance: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      const res = await api.get("/admin/adminDashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Erreur chargement stats admin:", err.message);
      setError("Impossible de charger les statistiques.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    {
      name: "Vue Globale",
      Utilisateurs: stats.totalUsers,
      Transactions: stats.totalTransactions,
      Solde: stats.totalBalance,
    },
  ];

  if (loading) return <div className="p-6">Chargement...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord Admin</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <Card className="bg-blue-100 text-blue-900">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">👥 Utilisateurs</h2>
            <p className="text-3xl mt-2">{stats.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-100 text-green-900">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">💸 Transactions</h2>
            <p className="text-3xl mt-2">{stats.totalTransactions}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-100 text-purple-900">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold">💼 Solde total</h2>
            <p className="text-3xl mt-2">{parseFloat(stats.totalBalance)} MAD</p>
          </CardContent>
        </Card>
      </div>

      <div className="bg-base-200 p-4 rounded-xl shadow">
        <h2 className="text-lg font-semibold mb-4">📈 Statistiques globales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Utilisateurs" fill="#3B82F6" />
            <Bar dataKey="Transactions" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboard;
