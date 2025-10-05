import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";

export default function Signup() {
    const { t } = useTranslation();
    const [name, setname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSignup = async () => {
        const { data: userData, error: signupError } = await supabase.auth.signUp(
            { email, password },
            { redirectTo: "http://localhost:5173/login" }
        );

        if (signupError) {
            setError(signupError.message);
            return;
        }

        // Insert full name into profiles table
        await supabase
            .from("profiles")
            .insert([{ id: userData.user.id, full_name: name }]);

        navigate("/login");
    };

    return (
        <div className="p-4 max-w-sm mx-auto mt-10 bg-white rounded shadow">
            <div className="absolute top-4 right-4">
                <LanguageSwitcher variant="auth" />
            </div>
            <h2 className="text-xl mb-4">{t("signup")}</h2>
            <input
                value={name}
                onChange={(e) => setname(e.target.value)}
                placeholder={t("name")}
                className="border p-2 mb-2 w-full"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t("email")}
                className="border p-2 mb-2 w-full"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t("password")}
                className="border p-2 mb-2 w-full"
            />
            <button
                onClick={handleSignup}
                className="bg-blue-500 text-white p-2 w-full rounded"
            >
                {t("signup")}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <p className="mt-2">
                <Link to="/login" className="text-blue-500">
                    {t("login")}
                </Link>
            </p>
        </div>
    );
}
