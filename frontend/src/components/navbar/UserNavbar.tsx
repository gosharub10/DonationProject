import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HandCoins, User, LogOut } from "lucide-react";

const UserNavbar = () => {
  const { logout } = useAuth();

  return (
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-2 rounded-xl text-white group-hover:bg-brand-secondary transition-colors">
              <HandCoins size={24} />
            </div>
            <span className="text-xl font-bold text-brand-primary tracking-wide hidden sm:block">
              Сохрани
            </span>
          </Link>

          {/* CENTER NAV */}
          <nav className="flex justify-center items-center gap-6 md:gap-8 font-medium">

            <Link
                to="/"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Главная
            </Link>

            <Link
                to="/projects"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Проекты
            </Link>

          </nav>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-3">
            {/* 🔥 PROFILE BUTTON */}
            <Link
                to="/profile"
                className="relative flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-700 hover:text-brand-primary transition-all duration-200 border border-brand-beige/50 hover:border-brand-primary/30 shadow-sm"
            >
              <User size={18} />
              <span className="hidden sm:block">Профиль</span>
              {/* маленький индикатор */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-accent rounded-full border border-white"></span>
            </Link>

            <button
                onClick={logout}
                title="Выйти"
                className="p-2.5 text-slate-500 hover:text-red-500 hover:bg-red-50 transition-colors duration-200 rounded-xl"
            >
              <LogOut size={20} />
            </button>
          </div>

        </div>
      </header>
  );
};

export default UserNavbar;