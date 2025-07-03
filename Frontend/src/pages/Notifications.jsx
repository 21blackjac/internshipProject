import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import api from "@/api/api";
import { useAuth } from "@clerk/clerk-react";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { getToken } = useAuth();

  useEffect(() => {
    // Exemple : détecter les transactions > 1000
    const fetchNotifications = async () => {
      try {
        let token = localStorage.getItem("token");

        if (!token) {
          token = await getToken({ template: "session" });
        }
        const res = await api.get("/users/transactions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const alerts = res.data
          .filter((t) => t.amount > 1000)
          .map((t) => ({
            message: `💰 Transaction élevée: ${t.amount} DH - ${t.description}`,
            date: t.date,
          }));
        setNotifications(alerts);
      } catch (err) {
        console.error("Erreur de notifications:", err);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Bell className="w-5 h-5" /> Notifications
      </h2>
      <ul className="space-y-2">
        {notifications.length ? (
          notifications.map((n, i) => (
            <li key={i} className="bg-yellow-100 p-3 rounded">
              <p>{n.message}</p>
              <small className="text-gray-500">{n.date}</small>
            </li>
          ))
        ) : (
          <p>Aucune alerte pour l'instant.</p>
        )}
      </ul>
    </div>
  );
};

export default Notifications;
