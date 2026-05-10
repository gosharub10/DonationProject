import { Link } from "react-router-dom";

const GuestNavbar = () => {
  return (
      <header className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <h2 className="text-2xl font-bold text-white tracking-wide">
            LOGO
          </h2>

          <nav className="flex justify-center items-center gap-6">
            <Link
                to="/"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Home
            </Link>

            <Link
                to="/projects"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Projects
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-4">
            <Link
                to="/login"
                className="text-slate-300 hover:text-blue-400 transition-colors duration-200"
            >
              Login
            </Link>

            <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 transition-colors duration-200 px-4 py-2 rounded-xl text-white font-medium shadow-lg shadow-blue-600/20"
            >
              Register
            </Link>
          </div>
        </div>
      </header>
  );
};

export default GuestNavbar;