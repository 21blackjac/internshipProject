import { useEffect, useState } from "react";
import api from "@/api/api";
import TransactionForm from "./Forms/TransactionForm";
import { Button } from "@/components/ui/button";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchTransactions = async () => {
    const res = await api.get("/admin/transactions", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setTransactions(res.data);
  };

  const handleEdit = (tx) => {
    setSelected(tx);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/transactions/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchTransactions();
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter(
    (tx) =>
      tx.description?.toLowerCase().includes(search.toLowerCase()) ||
      tx.amount.toString().includes(search) ||
      tx.date.includes(search)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <input
          type="text"
          placeholder="🔍 Rechercher..."
          className="input input-bordered"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button
          onClick={() => {
            setSelected(null);
            setShowForm(true);
          }}
        >
          Ajouter
        </Button>
      </div>
      {showForm && (
        <TransactionForm
          initialData={selected}
          onClose={() => {
            setShowForm(false);
            fetchTransactions();
          }}
        />
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Montant</th>
            <th>Type</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((tx) => (
            <tr key={tx.id}>
              <td>{tx.user_id}</td>
              <td>{tx.amount} MAD</td>
              <td>{tx.type}</td>
              <td>{tx.date}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(tx)}>
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(tx.id)}
                >
                  🗑️
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTransactions;
