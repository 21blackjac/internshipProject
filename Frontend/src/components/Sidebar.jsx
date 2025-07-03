import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Wallet, Tags, ReceiptText, User } from "lucide-react";

const Sidebar = () => {
  const { pathname } = useLocation();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { to: "/accounts", label: "Comptes", icon: <Wallet size={20} /> },
    { to: "/categories", label: "Catégories", icon: <Tags size={20} /> },
    {
      to: "/transactions",
      label: "Transactions",
      icon: <ReceiptText size={20} />,
    },
    { to: "/profile", label: "Profil", icon: <User size={20} /> },
  ];

  return (
    <div className="w-64 h-screen bg-base-200 p-4 shadow-lg">
      <h2 className="text-xl font-bold mb-6">💰 FinTrack</h2>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.to}>
            <Link
              to={link.to}
              className={`flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-base-300 ${
                pathname === link.to ? "bg-primary text-white" : ""
              }`}
            >
              {link.icon}
              <span>{link.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
