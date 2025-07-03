import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import {
  SignedOut,
  RedirectToSignIn,
} from "@clerk/clerk-react";

import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

import Login from "./components/Login";
import Register from "./components/Register";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

import MainLayout from "./layouts/MainLayout";
import Dashboard from "./pages/Dashboard";
import Accounts from "./pages/Accounts";
import Categories from "./pages/Categories";
import Transactions from "./pages/Transactions";
import Notifications from "./pages/Notifications";
import MyProfile from "./pages/MyProfile";

import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAccounts from "./pages/admin/AdminAccounts";
import AdminTransactions from "./pages/admin/AdminTransactions";
import AdminCategories from "./pages/admin/AdminCategories";

const App = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const attachToken = async () => {
      try {
        const token = await getToken();
        if (token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("❌ Erreur lors de l'obtention du token Clerk:", err);
      }
    };

    attachToken();
  }, [getToken]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (public) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Pages with MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="accounts" element={<Accounts />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="myprofile" element={<MyProfile />} />
        </Route>

        {/* Admin Pages with AdminLayout */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="accounts" element={<AdminAccounts />} />
          <Route path="transactions" element={<AdminTransactions />} />
          <Route path="categories" element={<AdminCategories />} />
        </Route>

        {/* Redirection vers login si non connecté */}
        <Route
          path="*"
          element={
            <SignedOut>
              <RedirectToSignIn />
            </SignedOut>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
