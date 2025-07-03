import { useEffect, useState } from "react";
import api from "@/api/api";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/clerk-react";

const MyProfile = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({ name: "", email: "", password: "" });

  const { getToken } = useAuth();

  const fetchProfile = async () => {
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      const res = await api.get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProfile({ ...res.data, password: "" });
    } catch (err) {
      console.error("Erreur lors du chargement du profil :", err);
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let token = localStorage.getItem("token");

      if (!token) {
        token = await getToken({ template: "session" });
      }
      await api.put("/users/profile", profile, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profil mis à jour !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour :", err);
      toast.error("Échec de la mise à jour.");
    }
  };

  const handleDelete = async () => {
    if (confirm("Voulez-vous vraiment supprimer votre compte ?")) {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          token = await getToken({ template: "session" });
        }
        await api.delete("/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast("Compte supprimé.");
        await signOut(); // Déconnexion Clerk
      } catch (err) {
        toast.error("Erreur lors de la suppression.");
        console.error("Erreur lors de la suppression du compte :", err);
      }
    }
  };

  const handleLogout = async () => {
    try {
      // Déconnexion de Clerk
      await signOut();
      localStorage.removeItem("token"); // Nettoyer le token local
      navigate("/login");
      toast.success("Déconnexion réussie !");
    } catch (err) {
      console.error("Erreur lors de la déconnexion :", err);
      toast.error("Échec de la déconnexion.");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h2 className="text-2xl font-bold">Mon profil</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          name="name"
          placeholder="Nom"
          value={profile.name}
          onChange={handleChange}
        />
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={profile.email}
          onChange={handleChange}
        />
        <Input
          name="password"
          type="password"
          placeholder="Mot de passe (laisser vide pour ne pas changer)"
          value={profile.password}
          onChange={handleChange}
        />
        <div className="flex gap-2">
          <Button type="submit">Mettre à jour</Button>
          <Button variant="destructive" onClick={handleDelete}>
            Supprimer mon compte
          </Button>
        </div>
      </form>
      <div className="pt-4">
        <Button variant="outline" onClick={handleLogout}>
          🔒 Se déconnecter
        </Button>
      </div>
    </div>
  );
};

export default MyProfile;
