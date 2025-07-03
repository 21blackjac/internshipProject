import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { toast } from "react-toastify";
import { useSignUp } from "@clerk/clerk-react";

const Register = () => {
  const navigate = useNavigate();
  const { signUp } = useSignUp();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Les mots de passe ne correspondent pas",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  }, [formData.password, formData.confirmPassword]);

  const handleGoogleSignUp = async () => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_google",
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error("❌ Google signup failed:", err);
      toast.error("Échec avec Google");
    }
  };

  const handleFacebookSignUp = async () => {
    try {
      await signUp.authenticateWithRedirect({
        strategy: "oauth_facebook",
        redirectUrl: "/dashboard",
      });
    } catch (err) {
      console.error("❌ Facebook sign-up failed:", err);
      toast.error("Échec avec Facebook");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (errors.confirmPassword) return;

    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      console.log("✅ Register response:", response.data);

      toast.success("Inscription réussie !");
      navigate("/login");
    } catch (error) {
      console.error("❌ Register error:", error);
      const errMsg = error.response?.data?.error || "Une erreur est survenue.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full overflow-hidden -z-10"
      style={{
        background: `
        radial-gradient(ellipse at 20% 30%, rgba(138,43,226,0.8) 0%, rgba(138,43,226,0) 60%),
        radial-gradient(ellipse at 80% 50%, rgba(0,191,255,0.7) 0%, rgba(0,191,255,0) 70%),
        radial-gradient(ellipse at 50% 80%, rgba(50,205,50,0.6) 0%, rgba(50,205,50,0) 65%),
        linear-gradient(135deg, #000000 0%, #0a0520 100%)
      `,
        backgroundBlendMode: "overlay, screen, hard-light",
        animation: "aurora-drift 25s infinite alternate ease-in-out",
      }}
    >
      <div
        className="fixed w-[200%] h-[200%] top-[-50%] left-[-50%] -z-10"
        style={{
          background: `
            repeating-linear-gradient(
              45deg,
              rgba(255,255,255,0.02) 0px,
              rgba(255,255,255,0.02) 1px,
              transparent 1px,
              transparent 40px
            ),
            repeating-linear-gradient(
              -45deg,
              rgba(255,255,255,0.03) 0px,
              rgba(255,255,255,0.03) 1px,
              transparent 1px,
              transparent 60px
            )`,
          animation: "grid-shift 20s linear infinite",
        }}
      />
      <div
        className="fixed w-full h-full -z-10"
        style={{
          background:
            "radial-gradient(circle at center, transparent 70%, rgba(10,5,32,0.9) 100%)",
          animation: "aurora-pulse 8s infinite alternate",
        }}
      />
      <style>{`
        @keyframes aurora-drift {
          0% {
            background-position: 0% 0%, 0% 0%, 0% 0%;
            filter: hue-rotate(0deg) brightness(1);
          }
          50% {
            background-position: -10% -5%, 5% 10%, 0% 15%;
            filter: hue-rotate(30deg) brightness(1.2);
          }
          100% {
            background-position: 5% 10%, -10% -5%, 15% 0%;
            filter: hue-rotate(60deg) brightness(1);
          }
        }

        @keyframes grid-shift {
          0% {
            transform: translate(0, 0);
          }
          100% {
            transform: translate(-50%, -50%);
          }
        }

        @keyframes aurora-pulse {
          0% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
        }
      `}</style>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className=" max-w-md p-8 space-y-6 rounded-xl shadow-lg border-gray-100">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800">
              Créez votre compte
            </h2>
            <p className="text-gray-500 mt-2">
              Rejoignez notre communauté dès aujourd'hui
            </p>
          </div>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <form onSubmit={handleSubmit}>
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                name="name"
                className="w-[95%] input input-bordered focus:input-primary mb-[15px]"
                placeholder="Ex: Mustapha Chaiq"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                className="w-[95%] input input-bordered focus:input-primary mb-[15px]"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                className="w-[95%] input input-bordered focus:input-primary mb-[15px]"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <label className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                className={`w-[95%] input input-bordered focus:input-primary mb-[15px] ${
                  errors.confirmPassword ? "input-error" : ""
                }`}
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}

              <button
                type="submit"
                className={`btn btn-primary mt-4 ml-[205px] ${
                  loading ? "loading" : ""
                }`}
                disabled={loading}
              >
                {loading ? "" : "S'inscrire"}
              </button>
            </form>
          </div>

          <div className="divider">OU</div>

          <div className="flex items-center justify-center ml-[20px] gap-[10px]">
            <button
              onClick={handleGoogleSignUp}
              className="btn btn-outline hover:bg-gray-50 flex items-center justify-center gap-3"
            >
              <img
                src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
                alt="Google"
                className="w-[25px] h-[25px] rounded-full"
              />
              S'inscrire avec Google
            </button>

            <button
              onClick={handleFacebookSignUp}
              className="btn btn-outline hover:bg-gray-50 flex items-center justify-center gap-3"
            >
              <img
                src="https://img.freepik.com/photos-premium/logo-facebook_1080029-107.jpg?semt=ais_hybrid&w=740"
                alt="Facebook"
                className="w-[25px] h-[25px] rounded-full"
              />
              S'inscrire avec Facebook
            </button>
          </div>

          <br />

          <div className="text-center text-sm text-gray-500 mt-4">
            Vous avez déjà un compte?{" "}
            <a href="/login" className="text-primary hover:underline">
              Connectez-vous
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
