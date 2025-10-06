import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ variant = "dashboard", setLangLoading, className = "" }) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        if (setLangLoading) setLangLoading(true);

        setTimeout(async () => {
            await i18n.changeLanguage(lng);
            localStorage.setItem("lang", lng);
            if (setLangLoading) setLangLoading(false);
        }, 300);
    };

    // Base classes depending on variant
    const baseClasses =
        variant === "dashboard"
            ? "border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
            : "border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500";

    return (
        <select
            className={`${baseClasses} ${className}`}
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
        >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
        </select>
    );
}
