import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Supprimer cet utilisateur ?")) {
      try {
        await api.delete(`/admin/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        fetchUsers();
      } catch (err) {
        console.error("Erreur suppression utilisateur:", err.message);
      }
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/users/${editingUser}`, form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setEditingUser(null);
      setForm({ name: "", email: "", password: "" });
      fetchUsers();
    } catch (err) {
      console.error("Erreur mise à jour:", err.message);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">👥 Gestion des Utilisateurs</h1>

      {editingUser && (
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 p-4 mb-4 rounded-xl shadow space-y-2"
        >
          <h2 className="text-lg font-semibold">✏️ Modifier Utilisateur</h2>
          <input
            type="text"
            className="input input-bordered w-full"
            placeholder="Nom"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            className="input input-bordered w-full"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="input input-bordered w-full"
            placeholder="Nouveau mot de passe (optionnel)"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <div className="flex gap-2">
            <Button type="submit">💾 Sauvegarder</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setEditingUser(null)}
            >
              ❌ Annuler
            </Button>
          </div>
        </form>
      )}

      <table className="table w-full mt-4">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td className="space-x-2">
                <Button size="sm" onClick={() => handleEdit(u)}>
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(u.id)}
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

export default AdminUsers;
