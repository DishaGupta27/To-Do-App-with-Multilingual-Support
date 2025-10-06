import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";
import toast from "react-hot-toast";

export default function CreateTaskModal({ onClose, setTasks, user }) {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [notes, setNotes] = useState("");
    const [priority, setPriority] = useState("medium");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const createTask = async () => {
        if (!user) return;
        if (!title.trim() || !notes.trim() || !priority.trim()) {
            setError(t("allFieldsRequired"));
            toast.error(t("Please fill in all fields"));
            return;
        }

        setError("");
        setLoading(true);

        const { data, error: supabaseError } = await supabase
            .from("tasks")
            .insert([
                {
                    title,
                    notes,
                    priority: priority.toLowerCase(),
                    status: "todo",
                    user_id: user.id,
                },
            ])
            .select("*");

        setLoading(false);

        if (supabaseError) {
            setError(supabaseError.message);
            toast.error(t("Failed to create task"));
        } else if (data?.length) {
            setTasks((prev) => [data[0], ...prev]);
            toast.success(t("Task created successfully!"));
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm"
        >
            <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-gray-700 w-96 transition-all">
                <h2 className="text-xl mb-4 font-semibold">{t("createTask")}</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input
                    type="text"
                    placeholder={t("title")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 w-full mb-3 rounded-lg transition-all"
                />
                <textarea
                    placeholder={t("notes")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 w-full mb-3 rounded-lg transition-all"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none p-2 w-full mb-3 rounded-lg transition-all"
                >
                    <option value="high">{t("high")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="low">{t("low")}</option>
                </select>

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={createTask}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center justify-center min-w-[80px]"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : t("save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
