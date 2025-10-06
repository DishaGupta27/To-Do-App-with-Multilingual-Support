import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Signup() {
    const { t } = useTranslation();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        const { data: userData, error: signupError } = await supabase.auth.signUp(
            { email, password },
            { redirectTo: "http://localhost:5173/login" }
        );

        setLoading(false);

        if (signupError) {
            setError(signupError.message);
            return;
        }

        if (userData?.user) {
            await supabase
                .from("profiles")
                .insert([{ id: userData.user.id, full_name: name }]);
        }

        navigate("/login");
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

                    {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-sky-500 text-white py-2 rounded-lg hover:bg-sky-600 transition font-medium"
                    >
                        {loading ? t("loading") : t("signup")}
                    </button>
                </form>

                <p className="text-center text-sm text-slate-500 mt-4">
                    {t("AlreadyhaveanAccount")} {" "}
                    <Link to="/login" className="text-sky-600 hover:underline">
                        {t("login")}
                    </Link>
                </p>
            </div>
        </div>
    );
}
