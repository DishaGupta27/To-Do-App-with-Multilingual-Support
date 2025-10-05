import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) setError(error.message);
        else navigate("/dashboard");
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-gray-100">
            {/* Language Switcher for Auth */}
            <div className="absolute top-4 right-4">
                <LanguageSwitcher variant="auth" />
            </div>

            <div className="p-6 shadow rounded bg-white w-full max-w-sm">
                <h2 className="text-xl mb-4">{t("login")}</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-3">
                    <input
                        type="email"
                        placeholder={t("email")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <input
                        type="password"
                        placeholder={t("password")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border p-2 w-full"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded w-full"
                    >
                        {t("login")}
                    </button>
                    <p className="mt-2">
                        <Link to="/signup" className="text-blue-500">{t("signup")}</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}
