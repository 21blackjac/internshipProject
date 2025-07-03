import { useEffect, useState } from "react";
import api from "@/api/api";
import AccountForm from "./Forms/AccountForm";
import { Button } from "@/components/ui/button";

const AdminAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchAccounts = async () => {
    const res = await api.get("/admin/accounts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setAccounts(res.data);
  };

  const handleEdit = (account) => {
    setSelected(account);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    await api.delete(`/admin/accounts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchAccounts();
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const filtered = accounts.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Comptes</h1>
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
        <AccountForm
          initialData={selected}
          onClose={() => {
            setShowForm(false);
            fetchAccounts();
          }}
        />
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Nom</th>
            <th>Solde</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((a) => (
            <tr key={a.id}>
              <td>{a.user_id}</td>
              <td>{a.name}</td>
              <td>{a.balance} MAD</td>
              <td>{a.type}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(a)}>
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(a.id)}
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

export default AdminAccounts;
