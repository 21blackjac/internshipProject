import React, { useEffect, useState } from "react";
import api from "../api/api";
import { format, parseISO } from "date-fns";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { exportToExcel, exportToPDF } from "@/utils/exportUtils";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [form, setForm] = useState({
    id: null,
    type: "income",
    amount: "",
    date: "",
    description: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/users/transactions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error("Erreur :", err);
    }
  };

  const fetchAccountsAndCategories = async () => {
    try {
      const [accRes, catRes] = await Promise.all([
        api.get("/users/accounts", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
        api.get("/users/categories", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }),
      ]);
      setAccounts(accRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error("Erreur de chargement comptes/catégories :", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await api.put(`/users/transactions/${form.id}`, form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await api.post("/users/transactions", form, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setShowForm(false);
      setForm({
        id: null,
        type: "income",
        amount: "",
        date: "",
        description: "",
      });
      fetchTransactions();
    } catch (err) {
      console.error("Erreur en soumettant :", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette transaction ?")) return;
    try {
      await api.delete(`/users/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchTransactions();
    } catch (err) {
      console.error("Erreur suppression :", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchAccountsAndCategories();
  }, []);

  useEffect(() => {
    let data = [...transactions];
    if (filterType) data = data.filter((t) => t.type === filterType);
    if (filterMonth)
      data = data.filter(
        (t) => new Date(t.date).getMonth() + 1 === parseInt(filterMonth)
      );
    if (filterYear)
      data = data.filter(
        (t) => new Date(t.date).getFullYear() === parseInt(filterYear)
      );
    setFiltered(data);
  }, [transactions, filterType, filterMonth, filterYear]);

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">💰 Transactions</h1>
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => exportToExcel(filtered)}
          className="btn btn-outline btn-success"
        >
          📤 Exporter Excel
        </button>
        <button
          onClick={() => exportToPDF(filtered)}
          className="btn btn-outline btn-error"
        >
          🖨️ Exporter PDF
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <Select onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Filtrer par type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="income">Revenu</SelectItem>
            <SelectItem value="expense">Dépense</SelectItem>
          </SelectContent>
        </Select>
        <Input
          type="number"
          placeholder="Mois (1-12)"
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Année"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button
              onClick={() =>
                setForm({
                  id: null,
                  type: "income",
                  amount: "",
                  date: "",
                  description: "",
                })
              }
            >
              Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white text-black p-4 rounded max-w-md">
            <DialogHeader>
              <DialogTitle>
                {form.id
                  ? "Modifier la transaction"
                  : "Ajouter une transaction"}
              </DialogTitle>
              <DialogDescription>
                {form.id
                  ? "Mettez à jour les détails"
                  : "Remplissez les détails de la nouvelle transaction"}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="select select-bordered w-full"
                >
                  <option value="income">Revenu</option>
                  <option value="expense">Dépense</option>
                </select>
              </div>

              <div>
                <label className="block">Montant</label>
                <input
                  type="number"
                  value={form.amount}
                  onChange={(e) => setForm({ ...form, amount: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block">Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="input input-bordered w-full"
                  required
                />
              </div>

              <div>
                <label className="block">Description</label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="block">Compte</label>
                <select
                  value={form.account_id}
                  onChange={(e) =>
                    setForm({ ...form, account_id: e.target.value })
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">-- Choisir un compte --</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block">Catégorie</label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  className="select select-bordered w-full"
                  required
                >
                  <option value="">-- Choisir une catégorie --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                {form.id ? "Mettre à jour" : "Ajouter"} la transaction
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full text-left border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-2">Type</th>
              <th className="p-2">Montant</th>
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t) => (
              <tr key={t.id} className="border-t border-gray-700">
                <td className="p-2 capitalize">{t.type}</td>
                <td className="p-2">{parseFloat(t.amount).toFixed(2)} MAD</td>
                <td className="p-2">
                  {format(parseISO(t.date), "dd/MM/yyyy")}
                </td>
                <td className="p-2">{t.description}</td>
                <td className="p-2 space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setForm({
                        id: t.id,
                        type: t.type,
                        amount: t.amount,
                        date: t.date.split("T")[0],
                        description: t.description,
                      });
                      setShowForm(true);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => handleDelete(t.id)}
                  >
                    Supprimer
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transactions;
