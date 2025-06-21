import { useState } from "react";
import api from "../api/api";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email });
      toast.success(res.data.message);
      setSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.error || "Erreur inattendue");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Mot de passe oublié
        </h2>
        {!success ? (
          <form onSubmit={handleSubmit}>
            <label className="block mb-2">Adresse e-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="input input-bordered w-full mb-4"
              placeholder="Votre email"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? "Envoi..." : "Envoyer le lien"}
            </button>
          </form>
        ) : (
          <p className="text-green-600 text-center">
            📧 Un email de réinitialisation a été envoyé si le compte existe.
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
