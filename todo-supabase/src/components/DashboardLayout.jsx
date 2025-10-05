import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LanguageSwitcher from "./LanguageSwitcher";
import CreateTaskModal from "./CreateTaskModal";
import TaskBoard from "./TaskBoard";
import LoadingSpinner from "./LoadingSpinner";
import { useTranslation } from "react-i18next";

export default function DashboardLayout() {
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all");
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);

    const [loadingTasks, setLoadingTasks] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [langLoading, setLangLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [filterPriority, setFilterPriority] = useState("");
    const [filterDate, setFilterDate] = useState("");

    const fetchTasks = async () => {
        setLoadingTasks(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;
        setUser(user);


        const { data: profileData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", user.id)
            .single();
        setProfile(profileData);

        let query = supabase.from("tasks").select("*").eq("user_id", user.id);
        if (filter !== "all") query = query.eq("status", filter);

        const { data, error } = await query.order("created_at", {
            ascending: false,
        });
        if (!error) setTasks(data);
        setLoadingTasks(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const logout = async () => {
        setLogoutLoading(true);
        setTimeout(async () => {
            await supabase.auth.signOut();
            window.location.href = "/login";
        }, 300);
    };

    if (loadingTasks) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text={t("loadingTasks")} />
            </div>
        );
    }

    if (logoutLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text={t("loggingOut")} />
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 relative">
            {langLoading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <LoadingSpinner size="lg" text={t("switchingLanguage")} />
                </div>
            )}

            <aside className="w-64 bg-blue-600 text-white flex flex-col">
                <h1 className="text-2xl font-bold p-4">{t("appName")}</h1>
                <div className="p-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
                    >
                        + {t("createTask")}
                    </button>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {["all", "completed", "in-progress", "todo"].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`w-full p-2 text-left rounded ${filter === status ? "bg-blue-500" : ""
                                }`}
                        >
                            {status === "all"
                                ? t("tasks")
                                : status === "in-progress"
                                    ? t("inProgress")
                                    : status === "todo"
                                        ? t("todo")
                                        : t("completed")}
                        </button>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 flex flex-col">
                <header className="flex justify-between items-center bg-white shadow p-4 gap-4 flex-wrap">
                    <div className="flex gap-2 flex-wrap items-center">
                        <input
                            type="text"
                            placeholder={t("searchPlacehold")}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border rounded px-3 py-2 max-w-xs w-full sm:w-auto"
                        />
                        <select
                            value={filterPriority}
                            onChange={(e) => setFilterPriority(e.target.value)}
                            className="border rounded px-3 py-2 max-w-xs w-full sm:w-auto"
                        >
                            <option value="">{t("allPriorities")}</option>
                            <option value="high">{t("high")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="low">{t("low")}</option>
                        </select>
                        <input
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                            className="border rounded px-3 py-2 max-w-xs w-full sm:w-auto"
                            placeholder={t("datePlaceholder")}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher
                            variant="dashboard"
                            setLangLoading={setLangLoading}
                        />
                        <span className="font-semibold bg-blue-600 text-white rounded-full px-3 py-1">
                            {profile?.full_name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || ""}
                        </span>
                        <button
                            onClick={logout}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                        >
                            {t("logout")}
                        </button>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-6">
                    <TaskBoard
                        tasks={tasks}
                        setTasks={setTasks}
                        searchTerm={searchTerm}
                        filterPriority={filterPriority}
                        filterDate={filterDate}
                        filter={filter}
                    />
                </main>
            </div>

            {showModal && (
                <CreateTaskModal
                    onClose={() => setShowModal(false)}
                    setTasks={setTasks}
                    user={user}
                />
            )}
        </div>
    );
}
