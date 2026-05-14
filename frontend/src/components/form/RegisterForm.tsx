import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

import type {UserRegister} from "../../models/UserRegister";

const RegisterForm = () => {
    const navigate = useNavigate();

    const [form, setForm] = useState<UserRegister>({
        name: "",
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        setError("");

        try {
            setLoading(true);

            await registerUser(form);

            navigate("/login");
        } catch (err: unknown) {
            if (err && typeof err === 'object' && 'response' in err) {
                const responseError = err as { response?: { data?: { message?: string } } };
                setError(responseError.response?.data?.message || "Ошибка регистрации");
            } else {
                setError("Ошибка регистрации");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 md:px-6">
            <div className="w-full max-w-md premium-card p-10 animate-fade-in relative z-10 shadow-2xl">

                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-slate-800 tracking-tight">
                        Создать аккаунт
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Зарегистрируйтесь, чтобы продолжить</p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            Имя
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            placeholder="Ваше имя"
                            className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm placeholder:text-slate-400 font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Ваш email"
                            className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm placeholder:text-slate-400 font-medium"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">
                            Пароль
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="Придумайте пароль"
                            className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm placeholder:text-slate-400 font-medium"
                            required
                        />
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-semibold flex items-center gap-2">
                            <span>⚠</span> {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-brand-primary hover:bg-brand-secondary text-white p-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-4 flex items-center justify-center gap-2"
                    >
                        {loading
                            ? <span className="animate-spin inline-block w-5 h-5 border-2 border-white/20 border-t-white rounded-full"></span>
                            : "Зарегистрироваться"}
                    </button>
                    
                    <div className="text-center mt-6">
                        <span className="text-slate-500 text-sm font-medium">Уже есть аккаунт? </span>
                        <button
                            type="button"
                            onClick={() => navigate('/login')}
                            className="text-brand-primary font-bold hover:text-brand-accent transition-colors text-sm"
                        >
                            Войти
                        </button>
                    </div>
                </form>
            </div>
            
            {/* Background elements */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-brand-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none mix-blend-multiply"></div>
            <div className="fixed bottom-20 left-20 w-100 h-100 bg-brand-accent/5 rounded-full blur-[90px] -z-10 pointer-events-none mix-blend-multiply"></div>
        </div>
    );
};

export default RegisterForm;