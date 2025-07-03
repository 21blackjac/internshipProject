import { Link, Outlet } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {FaDoorOpen, FaDashcube, FaUsers, FaMoneyBill, FaMoneyCheck, FaInfo} from "react-icons/fa";

const AdminLayout = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();
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
  
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-base-200 p-4 space-y-2">
        <h2 className="text-xl font-bold mb-4">👑 Admin Panel</h2>
        <ul className="list-none space-y-2 text-base-content font-semibold text-sm p-[0px]">
          <li className="decoration-primary no-underline">
            <Link className="btn btn-l w-full no-underline p-[0px]" to="/admin/">
              <FaDashcube />Dashboard
            </Link>
          </li>
          <li>
            <Link className="btn btn-l w-full no-underline p-[0px]" to="/admin/users">
              <FaUsers />Utilisateurs
            </Link>
          </li>
          <li>
            <Link className="btn btn-l w-full no-underline p-[0px]" to="/admin/accounts">
              <FaMoneyCheck />Comptes
            </Link>
          </li>
          <li>
            <Link className="btn btn-l w-full no-underline p-[0px]" to="/admin/transactions">
              <FaMoneyBill />Transactions
            </Link>
          </li>
          <li>
            <Link className="btn btn-l w-full no-underline p-[0px]" to="/admin/categories">
              <FaInfo />Catégories
            </Link>
          </li>
          <li className="mt-4 border-t pt-4 text-center text-red-500 !important">
            <span className="text-lg font-bold">⚠️ Attention ⚠️</span>
            <p className="text-sm">Toutes les actions sont irréversibles !</p>
            <button
              className="btn btn-l w-full no-underline p-[0px] bg-red-500 hover:bg-red-600"
              onClick={handleLogout}
            >
             <FaDoorOpen/> Déconnexion
            </button>
          </li>
        </ul>
      </aside>
      <main className="flex-1 p-6 bg-base-100">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
