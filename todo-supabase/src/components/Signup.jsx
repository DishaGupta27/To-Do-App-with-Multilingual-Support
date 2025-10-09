// src/components/Signup.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";
import toast from "react-hot-toast";

export default function Signup() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: userData, error } = await supabase.auth.signUp({
                email,
                password,
                options: { emailRedirectTo: "http://localhost:5173/login" },
            });

            setLoading(false);

            if (error) {
                const msg = error.message || "";
                const lower = msg.toLowerCase();

                if (lower.includes("already") || lower.includes("exists")) {
                    toast.error(t("emailalreadyinuse"));
                } else {
                    toast.error(t("signupfailed") + (msg ? `: ${msg}` : ""));
                }
                return;
            }

            if (userData?.user) {
                try {
                    await supabase.from("profiles").insert([
                        { id: userData.user.id, full_name: name },
                    ]);
                } catch {
                    toast.error(t("profilesavefailed"));
                }

                toast.success(t("signupsuccess"));
                setTimeout(() => navigate("/login"), 500);
                return;
            }

            // Otherwise, confirmation email flow
            toast.success(t("verificationemailsent"));
            navigate("/login");

        } catch (err) {
            setLoading(false);
            const msg = err?.message || String(err);
            toast.error(t("signupfailed") + (msg ? `: ${msg}` : ""));
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher />
            </div>

            <div className="bg-white shadow-md border border-slate-200 rounded-2xl w-[90%] max-w-md p-8">
                <h2 className="text-2xl font-semibold text-center text-slate-800 mb-6">
                    {t("signup")}
                </h2>

                <form onSubmit={handleSignup} className="space-y-5">
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t("name")}
                        required
                        className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-sky-400 outline-none"
                    />
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
                        className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition font-medium"
                    >
                        {loading ? t("loading") : t("signup")}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-4">
                    {t("AlreadyhaveanAccount")}{" "}
                    <Link to="/login" className="text-sky-600 hover:underline">
                        {t("login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
