import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { HandCoins, LayoutDashboard, LogOut, Gem, ReceiptText } from "lucide-react";

const FinanceNavbar = () => {
  const { logout } = useAuth();

  return (
    <header className="w-full">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/finance/dashboard" className="group flex items-center gap-2">
          <div className="rounded-xl bg-brand-primary p-2 text-white transition-colors group-hover:bg-brand-secondary">
            <HandCoins size={24} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wide text-brand-primary leading-none">
              Сохрани
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-secondary">
              Finance
            </span>
          </div>
        </Link>

        <nav className="hidden items-center justify-center gap-8 font-medium lg:flex">
          <Link to="/finance/dashboard" className="flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-brand-primary">
            <LayoutDashboard size={16} />
            Дашборд
          </Link>
          <Link to="/finance/projects" className="flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-brand-primary">
            <Gem size={16} />
            Проекты
          </Link>
          <Link to="/public/donations" className="flex items-center gap-2 text-slate-600 transition-colors duration-200 hover:text-brand-primary">
            <ReceiptText size={16} />
            Публичные донаты
          </Link>
        </nav>

        <div className="flex items-center justify-end gap-3">
          <div className="hidden items-center gap-2 rounded-lg bg-brand-primary/10 px-3 py-1.5 text-sm font-semibold text-brand-primary sm:flex">
            <Gem size={16} />
            FinanceManager
          </div>

          <button
            onClick={logout}
            title="Выйти"
            className="rounded-xl p-2.5 text-slate-500 transition-colors duration-200 hover:bg-red-50 hover:text-red-500"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default FinanceNavbar;
