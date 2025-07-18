// src/components/Layout.jsx
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-64 p-6 w-full min-h-screen bg-base-100">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
