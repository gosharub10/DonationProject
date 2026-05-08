import { useAuth } from "../../context/AuthContext";

import GuestNavbar from "../navbar/GuestNavbar";
import UserNavbar from "../navbar/UserNavbar";
import AdminNavbar from "../navbar/AdminNavbar";

const MainLayout = ({ children }: any) => {
  const { user } = useAuth();

  return (
    <>
      {!user && <GuestNavbar />}

      {user?.role === "Admin" && <AdminNavbar />}

      {user?.role !== "Admin" && user && <UserNavbar />}

      {children}
    </>
  );
};

export default MainLayout;