// src/components/Login.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import toast from "react-hot-toast";

export default function Login() {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            setLoading(false);

            if (error) {
                const msg = error.message || "";
                const lower = msg.toLowerCase();

                if (lower.includes("invalid") || lower.includes("credentials") || lower.includes("wrong")) {
                    toast.error(t("invalid_credentials"));
                } else {
                    toast.error(t("login_failed") + (msg ? `: ${msg}` : ""));
                }
                return;
            }

            toast.success(t("login_success"));
            setTimeout(() => navigate("/dashboard"), 700);

        } catch (err) {
            setLoading(false);
            const msg = err?.message || String(err);
            toast.error(t("login_failed") + (msg ? `: ${msg}` : ""));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>

            <div className="bg-white shadow-md border border-slate-200 rounded-2xl w-[90%] max-w-md p-8">
                <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
                    {t("login")}
                </h2>

                <form onSubmit={handleLogin} className="space-y-5">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t("email")}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t("password")}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition font-medium flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <svg
                                className="animate-spin h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                ></path>
                            </svg>
                        )}
                        <span>{loading ? t("loading") : t("login")}</span>
                    </button>

                </form>

                <p className="text-center text-sm text-slate-500 mt-4">
                    {t("DonthaveanAccount")}{" "}
                    <Link to="/signup" className="text-sky-600 hover:underline">
                        {t("signup")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
