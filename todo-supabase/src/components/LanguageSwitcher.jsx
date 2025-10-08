import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ variant = "dashboard", setLangLoading, className = "" }) {
    const { i18n } = useTranslation();

    const changeLanguage = async (lng) => {
        if (setLangLoading) setLangLoading(true);

        try {

            await new Promise((resolve) => setTimeout(resolve, 300));

            await i18n.changeLanguage(lng);
            localStorage.setItem("lang", lng);
        } catch (error) {
            console.error("Language switch failed:", error);
        } finally {

            setTimeout(() => {
                if (setLangLoading) setLangLoading(false);
            }, 100);
        }
    };

    const baseClasses =
        variant === "dashboard"
            ? "border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white dark:border-gray-600"
            : "border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 dark:bg-gray-800 dark:text-white dark:border-gray-600";

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
