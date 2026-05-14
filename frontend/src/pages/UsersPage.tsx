import { useEffect, useState } from "react";
import { Search, Users, Edit2, Trash2, X, Save, Shield } from "lucide-react";
import { getUsers, deleteUser, updateUser } from "../services/userService";
import type { UserData } from "../models/UserData";
import type { UserUpdate } from "../models/UserUpdate";

const UsersPage = () => {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [editUser, setEditUser] = useState<UserUpdate | null>(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Вы уверены, что хотите удалить этого пользователя?")) return;
        await deleteUser(id);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const handleUpdate = async () => {
        if (!editUser) return;
        await updateUser(editUser);
        setEditUser(null);
        fetchUsers();
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full"></div>
            </div>
        );
    }

    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 max-w-7xl animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
                        <Users size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Пользователи</h1>
                        <p className="text-slate-500 font-medium">Управление аккаунтами платформы</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                    <span className="text-slate-500 text-sm font-bold uppercase tracking-wider">Всего:</span>
                    <span className="text-xl font-black text-brand-primary">{users.length}</span>
                </div>
            </div>

            <div className="premium-card p-6 mb-8">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Поиск по имени или email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="premium-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-200">
                        <thead className="bg-slate-50/80 border-b border-slate-200">
                            <tr>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Имя</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Email</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Роль</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Регистрация</th>
                                <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-slate-500 font-medium">
                                        Пользователи не найдены
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
                                        <td className="p-4 font-bold text-slate-800">
                                            {u.name}
                                        </td>
                                        <td className="p-4 text-slate-600 font-medium">
                                            {u.email}
                                        </td>
                                        <td className="p-4">
                                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                                                u.role === "Admin" 
                                                    ? "bg-brand-primary/10 text-brand-primary border border-brand-primary/20" 
                                                    : "bg-slate-100 text-slate-600 border border-slate-200"
                                            }`}>
                                                {u.role === "Admin" && <Shield size={12} />}
                                                {u.role === "Admin" ? "Администратор" : "Пользователь"}
                                            </span>
                                        </td>
                                        <td className="p-4 text-slate-500 font-medium text-sm">
                                            {new Date(u.createdAt).toLocaleDateString("ru-RU", {
                                                day: '2-digit', month: '2-digit', year: 'numeric'
                                            })}
                                        </td>
                                        <td className="p-4 flex gap-2 justify-end">
                                            <button
                                                onClick={() => setEditUser({ id: u.id, name: u.name, email: u.email, role: u.role })}
                                                className="p-2 text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors tooltip-trigger"
                                                title="Редактировать"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(u.id)}
                                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors tooltip-trigger"
                                                title="Удалить"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* EDIT MODAL */}
            {editUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h2 className="text-xl font-bold flex items-center gap-2 text-slate-800">
                                <Edit2 size={20} className="text-brand-primary" />
                                Редактирование
                            </h2>
                            <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600 transition-colors p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6 space-y-5 overflow-y-auto">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Имя</label>
                                <input
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                                    value={editUser.name}
                                    onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Email</label>
                                <input
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium"
                                    value={editUser.email}
                                    onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 ml-1">Роль</label>
                                <select
                                    className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all font-medium appearance-none cursor-pointer"
                                    value={editUser.role}
                                    onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
                                >
                                    <option value="User">Пользователь (User)</option>
                                    <option value="Admin">Администратор (Admin)</option>
                                    <option value="FinanceManager">Финансист (FinanceManager)</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
                            <button
                                onClick={handleUpdate}
                                className="flex-1 bg-brand-primary hover:bg-brand-secondary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 hover:shadow-md active:scale-95"
                            >
                                <Save size={18} /> Сохранить
                            </button>
                            <button
                                onClick={() => setEditUser(null)}
                                className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-3 rounded-xl font-bold transition-all active:scale-95"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
