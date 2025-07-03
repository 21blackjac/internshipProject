// src/layouts/MainLayout.jsx
import React from "react";
import { Link, Outlet } from "react-router-dom";

const MainLayout = () => {

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <nav className="bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="font-bold text-xl">💰 FinanceApp</h1>
        <div className="space-x-4 flex justify-between absolute left-[30%] gap-[50px]">
          <Link to="/dashboard" className="no-underline">Dashboard</Link>
          <Link to="/transactions" className="no-underline">Transactions</Link>
          <Link to="/accounts" className="no-underline">Comptes</Link>
          <Link to="/categories" className="no-underline">Catégories</Link>
          <Link to="/notifications" className="no-underline">Notifications</Link>
          <Link to="/MyProfile" className="no-underline">My Profile</Link>
        </div>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
