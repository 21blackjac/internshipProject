import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/clerk-react";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const { getToken } = useAuth();

  const fetchCategories = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      const res = await api.get("/users/categories", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data);
    } catch (error) {
      console.error("Erreur lors du chargement :", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      if (editingId) {
        const res = await api.put(
          `/users/categories/${editingId}`,
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Catégorie mise à jour :", res.data);
      } else {
        const res = await api.post("/users/categories", { name }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("Catégorie ajoutée :", res.data);
      }
      setName("");
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de l'envoi :", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      const res = await api.delete(`/users/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Catégorie supprimée :", res.data);
      fetchCategories();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Catégories</h2>
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered"
        />
        <Button type="submit">{editingId ? "Modifier" : "Ajouter"}</Button>
      </form>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat.id} className="flex justify-between items-center">
            <span>{cat.name}</span>
            <div className="space-x-2">
              <Button
                size="sm"
                onClick={() => {
                  setEditingId(cat.id);
                  setName(cat.name);
                }}
              >
                ✏️
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(cat.id)}
              >
                🗑️
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
