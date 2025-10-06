import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

export default function ReadMoreModal({ task, onClose, editTask, t, lang = "en" }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || "");
    const [notes, setNotes] = useState(task.notes || "");
    const [priority, setPriority] = useState(task.priority || "medium");
    const [updatedAtStr, setUpdatedAtStr] = useState(task.updated_at || task.created_at || "");
    const [error, setError] = useState("");

    useEffect(() => {
        setTitle(task.title || "");
        setNotes(task.notes || "");
        setPriority(task.priority || "medium");
        setUpdatedAtStr(task.updated_at || task.created_at || "");
    }, [task]);

    const saveEdit = async () => {
        if (!title.trim() || !notes.trim() || !priority.trim()) {
            setError(t("allFieldsRequired"));
            toast.error(t("Please fill in all fields"));
            return;
        }
        setError("");

        try {
            const updatedTask = await editTask(task.id, {
                title: title.trim(),
                notes: notes.trim(),
                priority: priority.toLowerCase(),
            });

            if (updatedTask?.updated_at) {
                setUpdatedAtStr(updatedTask.updated_at);
                toast.success(t("Task updated successfully!"));
            }

            setIsEditing(false);
        } catch (err) {
            console.error("Error updating task:", err.message);
            toast.error(t("Failed to update task"));
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
            <div className="relative bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.1)] border border-gray-200 dark:border-gray-700 w-96 max-w-[90%] transition-all">
                {isEditing ? (
                    <div className="flex flex-col gap-3">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2 rounded-lg"
                        />
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2 rounded-lg"
                            rows={5}
                        />
                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:outline-none px-3 py-2 rounded-lg"
                        >
                            <option value="high">{t("high")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="low">{t("low")}</option>
                        </select>
                        <div className="flex gap-3 justify-end mt-2">
                            <button
                                onClick={saveEdit}
                                className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all"
                            >
                                {t("save")}
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl font-bold break-words">{title}</h2>
                        <p className="whitespace-pre-wrap break-words">{notes}</p>
                        <p className="text-sm mt-2">
                            {t("priority")}:{" "}
                            <span
                                className={
                                    priority === "high"
                                        ? "text-red-500"
                                        : priority === "medium"
                                            ? "text-yellow-500"
                                            : "text-green-500"
                                }
                            >
                                {t(priority)}
                            </span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                            {t("created")}: {task.created_at ? formatDate(task.created_at, lang) : ""}
                        </p>
                        <p className="text-xs text-gray-500">
                            {t("updated")}: {updatedAtStr ? formatDate(updatedAtStr, lang) : ""}
                        </p>
                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all"
                            >
                                {t("edit")}
                            </button>
                            <button
                                onClick={onClose}
                                className="px-3 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-all"
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
