import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";

const CategoryForm = ({ initialData }) => {
  const [form, setForm] = useState({ name: "", user_defined: true });

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await api.put(`/admin/categories/${initialData.id}`, form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      } else {
        await api.post("/admin/categories", form, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
      }
    } catch (err) {
      console.error("Erreur catégorie:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom de la catégorie"
        className="input input-bordered w-full"
        required
      />

      <select
        name="user_defined"
        value={form.user_defined ? "true" : "false"}
        onChange={(e) =>
          setForm({ ...form, user_defined: e.target.value === "true" })
        }
        className="select select-bordered w-full"
      >
        <option value="true">Personnalisée</option>
        <option value="false">Par défaut</option>
      </select>

      <Button type="submit">{initialData ? "Mettre à jour" : "Créer"}</Button>
    </form>
  );
};

export default CategoryForm;
