import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";

const AccountForm = ({ initialData }) => {
  const [form, setForm] = useState({ name: "", balance: 0, type: "checking" });

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
        await api.put(`/admin/accounts/${initialData.id}`, form);
      } else {
        await api.post("/admin/accounts", form);
      }
      setForm({ name: "", balance: 0, type: "checking" });
    } catch (err) {
      console.error("Erreur lors de la soumission du compte:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Nom du compte"
        className="input input-bordered w-full"
        required
      />
      <input
        name="balance"
        type="number"
        value={form.balance}
        onChange={handleChange}
        placeholder="Solde"
        className="input input-bordered w-full"
        required
      />
      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="checking">Compte courant</option>
        <option value="savings">Épargne</option>
      </select>
      <Button type="submit">{initialData ? "Mettre à jour" : "Créer"}</Button>
    </form>
  );
};

export default AccountForm;
