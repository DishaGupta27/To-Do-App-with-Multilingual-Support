import React, { useState, useEffect } from "react";
import { formatDate } from "../utils/formatDate";
import toast from "react-hot-toast";

export default function TaskCard({
    task,
    deleteTask,
    toggleStatus,
    editTask,
    setSelectedTask,
    t,
    lang,
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(task.title || "");
    const [notes, setNotes] = useState(task.notes || "");
    const [priority, setPriority] = useState(task.priority || "medium");
    const [error, setError] = useState("");

    useEffect(() => {
        setTitle(task.title || "");
        setNotes(task.notes || "");
        setPriority(task.priority || "medium");
    }, [task]);

    const saveEdit = async () => {
        if (!title.trim() || !notes.trim() || !priority.trim()) {
            setError(t("allFieldsRequired"));
            toast.error(t("Pleasefillinallfields"));
            return;
        }

        setError("");

        try {
            const updatedTask = await editTask(task.id, {
                title: title.trim(),
                notes: notes.trim(),
                priority: priority.toLowerCase(),
            });

            if (updatedTask) {
                setIsEditing(false);
                toast.success(t("Taskupdatedsuccessfully!"));
            }
        } catch (error) {
            toast.error(t("Failedtoupdatetask"));
            console.error(error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteTask(task.id);
            toast.success(t("Taskdeletedsuccessfully"));
        } catch (error) {
            toast.error(t("Failedtodeletetask"));
        }
    };

    const handleToggleStatus = async (status) => {
        try {
            await toggleStatus(task, status);
            toast.success(
                status === "completed"
                    ? t("Taskmarkedascompleted")
                    : status === "in-progress"
                        ? t("Taskmovedtoinprogress")
                        : t("Taskmovedtotodo")
            );
        } catch (error) {
            toast.error(t("Failedtoupdatestatus"));
        }
    };

    const priorityColor =
        priority === "high"
            ? "bg-red-500"
            : priority === "medium"
                ? "bg-amber-400"
                : "bg-emerald-500";

    return (
        <article className="w-full bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden transition-transform hover:-translate-y-1 flex flex-col justify-between">

            {/* Top Priority Bar */}
            <div className={`h-1 ${priorityColor}`} />

            <div className="p-3 flex flex-col">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        {error && <p className="text-red-500 text-xs">{error}</p>}

                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-sm"
                        />

                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-sm"
                            rows={3}
                        />

                        <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-sm"
                        >
                            <option value="high">{t("high")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="low">{t("low")}</option>
                        </select>
                    </div>
                ) : (
                    <div className="flex flex-col">
                        {/* Task Title */}
                        <h4
                            className="font-semibold text-slate-800 dark:text-gray-100 text-base mb-1 line-clamp-1"
                            title={title}
                        >
                            {title}
                        </h4>

                        {/* Notes with Read More */}
                        {notes ? (
                            <p className="text-sm text-slate-500 dark:text-gray-400 mb-2 line-clamp-3">
                                {notes.length > 140 ? (
                                    <>
                                        {notes.slice(0, 140)}...{" "}
                                        <button
                                            onClick={() => setSelectedTask(task)}
                                            className="text-blue-500 underline text-xs"
                                        >
                                            {t("readMore")}
                                        </button>
                                    </>
                                ) : (
                                    notes
                                )}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-400 mb-2">{t("noNotes")}</p>
                        )}

                        <div className="text-sm text-slate-500 dark:text-gray-400 mb-2">
                            {t("priority")}:{" "}
                            <span
                                className={
                                    priority === "high"
                                        ? "text-red-500"
                                        : priority === "medium"
                                            ? "text-amber-500"
                                            : "text-emerald-500"
                                }
                            >
                                {t(priority)}
                            </span>
                        </div>

                        <div className="text-xs text-slate-400 dark:text-gray-500 space-y-0.5">
                            <div>
                                {t("created")}:{" "}
                                {task.created_at ? formatDate(task.created_at, lang) : ""}
                            </div>
                            <div>
                                {t("updated")}:{" "}
                                {task.updated_at ? formatDate(task.updated_at, lang) : ""}
                            </div>
                        </div>
                    </div>
                )}

                {/* Buttons */}
                <div className="flex items-center justify-start gap-1.5 mt-3 flex-wrap">
                    <button
                        onClick={handleDelete}
                        className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:opacity-90"
                    >
                        {t("delete")}
                    </button>

                    {task.status !== "completed" && (
                        <button
                            onClick={() => handleToggleStatus("completed")}
                            className="px-2 py-1 text-xs bg-emerald-500 text-white rounded hover:opacity-90"
                        >
                            {t("complete")}
                        </button>
                    )}

                    {task.status !== "in-progress" && (
                        <button
                            onClick={() => handleToggleStatus("in-progress")}
                            className="px-2 py-1 text-xs bg-amber-400 text-white rounded hover:opacity-90"
                        >
                            {t("progress")}
                        </button>
                    )}

                    {task.status !== "todo" && (
                        <button
                            onClick={() => handleToggleStatus("todo")}
                            className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:opacity-90"
                        >
                            {t("todo")}
                        </button>
                    )}

                    {isEditing ? (
                        <button
                            onClick={saveEdit}
                            className="px-2 py-1 text-xs bg-green-500 text-white rounded hover:opacity-90"
                        >
                            {t("save")}
                        </button>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-2 py-1 text-xs bg-sky-500 text-white rounded hover:opacity-90"
                        >
                            {t("edit")}
                        </button>
                    )}
                </div>
            </div>
        </article>
    );
}
