import { Link } from "react-router-dom";
import { HandCoins } from "lucide-react";

const GuestNavbar = () => {
  return (
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-brand-primary p-2 rounded-xl text-white group-hover:bg-brand-secondary transition-colors">
              <HandCoins size={24} />
            </div>
            <span className="text-xl font-bold text-brand-primary tracking-wide">
              Сохрани
            </span>
          </Link>

          <nav className="hidden md:flex justify-center items-center gap-8 font-medium">
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
          <div className="flex justify-end items-center gap-4">
            <Link
                to="/login"
                className="text-slate-600 font-medium hover:text-brand-primary transition-colors duration-200"
            >
              Войти
            </Link>

            <Link
                to="/register"
                className="bg-brand-primary hover:bg-brand-secondary transition-colors duration-300 px-5 py-2.5 rounded-xl text-white font-medium shadow-md hover:shadow-lg"
            >
              Создать аккаунт
            </Link>
          </div>
        </div>
      </header>
  );
};

export default GuestNavbar;