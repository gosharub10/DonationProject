import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HandCoins, ShieldCheck, LogOut } from "lucide-react";

const AdminNavbar = () => {
  const { logout } = useAuth();

  return (
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* LEFT */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-2 rounded-xl text-white group-hover:bg-brand-secondary transition-colors">
              <HandCoins size={24} />
            </div>
            <div className="flex flex-col sm:flex">
              <span className="text-xl font-bold text-brand-primary tracking-wide leading-none">
                Сохрани
              </span>
              <span className="text-[10px] text-brand-secondary uppercase tracking-widest font-bold">
                Admin
              </span>
            </div>
          </Link>

          {/* CENTER */}
          <nav className="hidden lg:flex justify-center items-center gap-8 font-medium">
            <Link
                to="/"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Главная
            </Link>

            <Link
                to="/admin"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Дашборд
            </Link>

            <Link
                to="/admin/users"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Пользователи
            </Link>

            <Link
                to="/admin/projects"
                className="text-slate-600 hover:text-brand-primary transition-colors duration-200"
            >
              Проекты
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex justify-end items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-lg text-sm font-semibold">
              <ShieldCheck size={16} />
              Admin
            </div>
            
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

export default AdminNavbar;