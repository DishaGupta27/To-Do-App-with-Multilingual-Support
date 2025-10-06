import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import LoadingSpinner from "./LoadingSpinner";

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
        } else if (data?.length) {
            setTasks((prev) => [data[0], ...prev]);
            onClose();
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    return (
        <div
            onClick={handleOverlayClick}
            className="fixed inset-0 z-50 flex justify-center items-center bg-black/50 backdrop-blur-sm"
        >
            <div className="bg-white text-black p-6 rounded-lg shadow-2xl w-96">
                <h2 className="text-xl mb-4 font-semibold">{t("createTask")}</h2>

                {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                <input
                    type="text"
                    placeholder={t("title")}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border p-2 w-full mb-3 rounded"
                />
                <textarea
                    placeholder={t("notes")}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="border p-2 w-full mb-3 rounded"
                />
                <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="border p-2 w-full mb-3 rounded"
                >
                    <option value="high">{t("high")}</option>
                    <option value="medium">{t("medium")}</option>
                    <option value="low">{t("low")}</option>
                </select>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        {t("cancel")}
                    </button>
                    <button
                        onClick={createTask}
                        disabled={loading}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center justify-center min-w-[80px]"
                    >
                        {loading ? <LoadingSpinner size="sm" /> : t("save")}
                    </button>
                </div>
            </div>
        </div>
    );
}
