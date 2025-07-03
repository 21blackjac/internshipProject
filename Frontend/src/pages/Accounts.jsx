import React, { useEffect, useState } from "react";
import api from "../api/api";
import { Trash2, Pencil } from "lucide-react";
import { useAuth } from "@clerk/clerk-react";

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ name: "", type: "", balance: "" });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { getToken } = useAuth();

  const fetchAccounts = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      const res = await api.get("/users/accounts", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccounts(res.data);
    } catch (error) {
      console.error("Erreur chargement comptes :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = editingId ? "put" : "post";
    const url = editingId ? `/users/accounts/${editingId}` : "/users/accounts";

    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      setLoading(true);
      await api[method](url, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchAccounts();
      setForm({ name: "", type: "", balance: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Erreur sauvegarde :", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (account) => {
    setForm(account);
    setEditingId(account.id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer ce compte ?")) return;
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      await api.delete(`/users/accounts/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchAccounts();
    } catch (error) {
      console.error("Erreur suppression :", error);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-4">🏦 Mes Comptes</h1>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="mb-6 grid gap-4 max-w-md">
        <input
          type="text"
          placeholder="Nom du compte"
          className="input input-bordered"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Type (ex: Épargne, Courant)"
          className="input input-bordered"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Solde"
          className="input input-bordered"
          value={form.balance}
          onChange={(e) => setForm({ ...form, balance: e.target.value })}
          required
        />
        <button className="btn btn-primary" disabled={loading}>
          {editingId ? "Modifier" : "Ajouter"}
        </button>
      </form>

      {/* Liste des comptes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {accounts.map((account) => (
          <div
            key={account.id}
            className="bg-base-200 p-4 rounded-lg flex justify-between items-center"
          >
            <div>
              <h2 className="text-xl font-semibold">{account.name}</h2>
              <p className="text-sm opacity-70">{account.type}</p>
              <p className="text-lg">
                {parseFloat(account.balance).toFixed(2)} MAD
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(account)}
                className="btn btn-sm"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(account.id)}
                className="btn btn-sm btn-error"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
