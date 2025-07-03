import { useEffect, useState } from "react";
import api from "@/api/api";
import CategoryForm from "./Forms/CategoryForm";
import { Button } from "@/components/ui/button";

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState(null);

  const fetchCategories = async () => {
    const res = await api.get("/admin/categories", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setCategories(res.data);
  };

  const handleEdit = (cat) => {
    setSelected(cat);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?"))
      return;
    try {
      await api.delete(`/admin/categories/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchCategories();
    } catch (err) {
      console.error("Erreur suppression catégorie:", err.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Catégories</h1>
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
        <CategoryForm
          initialData={selected}
          onClose={() => {
            setShowForm(false);
            fetchCategories();
          }}
        />
      )}
      <table className="table w-full">
        <thead>
          <tr>
            <th>Utilisateur</th>
            <th>Nom</th>
            <th>Définie par utilisateur</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((cat) => (
            <tr key={cat.id}>
              <td>{cat.user_id}</td>
              <td>{cat.name}</td>
              <td>{cat.user_defined ? "Oui" : "Non"}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(cat)}>
                  ✏️
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(cat.id)}
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

export default AdminCategories;
