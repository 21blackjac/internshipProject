import { useEffect, useState } from "react";
import api from "@/api/api";
import { Button } from "@/components/ui/button";

const TransactionForm = ({ initialData }) => {
  const [form, setForm] = useState({
    account_id: "",
    category_id: "",
    type: "expense",
    amount: 0,
    date: "",
    description: "",
  });
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    if (initialData) setForm(initialData);
    fetchAccounts();
    fetchCategories();
  }, [initialData]);

  const fetchAccounts = async () => {
    const res = await api.get("/admin/accounts");
    setAccounts(res.data);
  };

  const fetchCategories = async () => {
    const res = await api.get("/admin/categories");
    setCategories(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (initialData) {
        await api.put(`/admin/transactions/${initialData.id}`, form);
      } else {
        await api.post("/admin/transactions", form);
      }
    } catch (err) {
      console.error("Erreur transaction:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        name="account_id"
        value={form.account_id}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="">-- Sélectionner un compte --</option>
        {accounts.map((acc) => (
          <option key={acc.id} value={acc.id}>
            {acc.name}
          </option>
        ))}
      </select>

      <select
        name="category_id"
        value={form.category_id}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="">-- Catégorie --</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className="select select-bordered w-full"
      >
        <option value="income">Revenu</option>
        <option value="expense">Dépense</option>
      </select>

      <input
        name="amount"
        type="number"
        value={form.amount}
        onChange={handleChange}
        placeholder="Montant"
        className="input input-bordered w-full"
        required
      />

      <input
        name="date"
        type="date"
        value={form.date}
        onChange={handleChange}
        className="input input-bordered w-full"
        required
      />

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="input input-bordered w-full"
      />

      <Button type="submit">{initialData ? "Modifier" : "Ajouter"}</Button>
    </form>
  );
};

export default TransactionForm;
