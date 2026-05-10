import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { loginUser } from "../../services/authService";
import type { UserLogin } from "../../models/UserLogin";
import { useAuth } from "../../context/AuthContext";

interface JwtPayload {
    role: string;
}

const LoginForm = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<UserLogin>({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        try {
            setLoading(true);

            const data = await loginUser(form);

            // 🔥 логиним только токен
            login(data.token);

            // 🔥 декодим для роутинга
            const decoded = jwtDecode<JwtPayload>(data.token);

            if (decoded.role === "Admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }

        } catch (err: any) {
            setError(err?.response?.data?.message || "Login error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-6">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8">

                <h1 className="text-3xl font-bold text-white mb-6">
                    Login
                </h1>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="Email"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        required
                    />

                    <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Password"
                        className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white"
                        required
                    />

                    {error && (
                        <div className="text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"
                    >
                        {loading ? "Loading..." : "Login"}
                    </button>

                </form>
            </div>
        </div>
    );
};

export default LoginForm;