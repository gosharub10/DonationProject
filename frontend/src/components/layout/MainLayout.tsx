import { useAuth } from "../../context/AuthContext";

import GuestNavbar from "../navbar/GuestNavbar";
import UserNavbar from "../navbar/UserNavbar";
import AdminNavbar from "../navbar/AdminNavbar";

import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  const { user } = useAuth();

  const renderNavbar = () => {
    if (!user) return <GuestNavbar />;
    if (user.role === "Admin") return <AdminNavbar />;
    return <UserNavbar />;
  };

  return (
      <div className="min-h-screen flex flex-col bg-brand-light text-slate-800 font-sans">

        {/* HEADER (всегда сверху) */}
        <div className="sticky top-0 z-50 glass border-b-0 pb-0">
          {renderNavbar()}
        </div>

        {/* CONTENT */}
        <main className="flex-1 flex justify-center pt-10 pb-20">
          <div className="w-full max-w-6xl px-4 animate-fade-in">
            {children}
          </div>
        </main>

      </div>
  );
};

export default MainLayout;