import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 grid grid-cols-3 items-center">

          {/* LEFT */}
          <div>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              Admin Panel
            </h2>
          </div>

          {/* CENTER */}
          <nav className="flex justify-center items-center gap-6">
            <Link
                to="/"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Home
            </Link>

            <Link
                to="/admin"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Dashboard
            </Link>

            <Link
                to="/admin/users"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Users
            </Link>

            <Link
                to="/admin/projects"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Projects
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex justify-end">
            <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 transition-colors duration-200 px-4 py-2 rounded-xl text-white font-medium shadow-lg shadow-red-600/20"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
  );
};

export default AdminNavbar;