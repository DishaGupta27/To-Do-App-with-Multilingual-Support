import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";

export default function TaskCard({ task, deleteTask, toggleStatus, editTask, setSelectedTask, t, lang }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || "");
    const [notes, setNotes] = useState(task.notes || "");
    const [priority, setPriority] = useState(task.priority || "medium");
    const [error, setError] = useState("");

    useEffect(() => {
        setTitle(task.title || "");
        setNotes(task.notes || "");
        setPriority(task.priority || "medium");

        console.log("📌 Task loaded:", task);
    }, [task]);

    const saveEdit = async () => {
        if (!title.trim() || !notes.trim() || !priority.trim()) {
            setError(t("allFieldsRequired"));
            return;
        }
        setError("");

        const updatedTask = await editTask(task.id, {
            title: title.trim(),
            notes: notes.trim(),
            priority: priority.toLowerCase(),
        });

        if (updatedTask) {
            setIsEditing(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 p-3 mb-3 rounded shadow flex flex-col justify-between min-h-[220px] border border-gray-200 dark:border-gray-700">
            {isEditing ? (
                <div className="flex flex-col gap-2">
                    {error && <p className="text-red-500 text-xs">{error}</p>}
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="border px-2 py-1 rounded"
                    />
                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="border px-2 py-1 rounded"
                    >
                        <option value="high">{t("high")}</option>
                        <option value="medium">{t("medium")}</option>
                        <option value="low">{t("low")}</option>
                    </select>
                </div>
            ) : (
                <div>
                    <p
                        className="font-semibold text-base mb-1 overflow-hidden text-ellipsis"
                        style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical" }}
                        title={title}
                    >
                        {title}
                    </p>

                    {notes && (
                        <p
                            className="text-sm text-gray-500"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 3,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                            }}
                        >
                            {notes.length > 100 ? (
                                <>
                                    {notes.slice(0, 100)}...{" "}
                                    <button
                                        onClick={() => setSelectedTask(task)}
                                        className="text-blue-500 text-xs underline"
                                    >
                                        {t("readMore")}
                                    </button>
                                </>
                            ) : (
                                notes
                            )}
                        </p>
                    )}

                    <p className="text-sm mt-1">
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

                    <p className="text-xs text-gray-400 mt-1">
                        {t("created")}:{" "}
                        {task.created_at ? formatDate(task.created_at, lang) : ""}
                    </p>
                    <p className="text-xs text-gray-400">
                        {t("updated")}:{" "}
                        {task.updated_at ? formatDate(task.updated_at, lang) : ""}
                    </p>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
                <button
                    onClick={() => deleteTask(task.id)}
                    className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                >
                    {t("delete")}
                </button>

                {task.status !== "completed" && (
                    <button
                        onClick={() => toggleStatus(task, "completed")}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {t("complete")}
                    </button>
                )}

                {task.status !== "in-progress" && (
                    <button
                        onClick={() => toggleStatus(task, "in-progress")}
                        className="px-2 py-1 text-xs bg-yellow-500 text-white rounded hover:bg-yellow-600"
                    >
                        {t("progress")}
                    </button>
                )}

                {task.status !== "todo" && (
                    <button
                        onClick={() => toggleStatus(task, "todo")}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {t("todo")}
                    </button>
                )}

                {isEditing ? (
                    <button
                        onClick={saveEdit}
                        className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        {t("save")}
                    </button>
                ) : (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {t("edit")}
                    </button>
                )}
            </div>
        </div>
    );
}
