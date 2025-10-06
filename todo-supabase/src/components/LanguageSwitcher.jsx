import React from "react";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher({ variant = "dashboard", setLangLoading }) {
    const { i18n } = useTranslation();

    const changeLanguage = (lng) => {
        if (setLangLoading) setLangLoading(true);

        // Add a tiny delay to show the spinner
        setTimeout(async () => {
            await i18n.changeLanguage(lng);
            localStorage.setItem("lang", lng);
            if (setLangLoading) setLangLoading(false);
        }, 300); // 200ms delay ensures spinner is visible
    };

    return (
        <select
            onChange={(e) => changeLanguage(e.target.value)}
            value={i18n.language}
            className={
                variant === "dashboard"
                    ? "border rounded px-3 py-2 text-sm"
                    : "text-sm border rounded px-2 py-1"
            }
        >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
        </select>
    );
}
