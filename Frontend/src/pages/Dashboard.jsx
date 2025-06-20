import { useUser, RedirectToSignIn } from "@clerk/clerk-react";

const Dashboard = () => {
  const { isSignedIn, user } = useUser();

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold">Bienvenue, {user?.firstName}</h2>
    </div>
  );
};
export default Dashboard;
