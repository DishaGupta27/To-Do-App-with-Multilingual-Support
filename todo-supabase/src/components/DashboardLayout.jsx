import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import LanguageSwitcher from "./LanguageSwitcher";
import CreateTaskModal from "./CreateTaskModal";
import TaskBoard from "./TaskBoard";
import LoadingSpinner from "./LoadingSpinner";
import SkeletonDashboard from "./SkeletonDashboard";
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;


    const fetchTasks = async () => {
        setLoadingTasks(true);
        const { data: { user } } = await supabase.auth.getUser();
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
        const { data, error } = await query.order("created_at", { ascending: false });
        if (!error) setTasks(data);
        setLoadingTasks(false);
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) setIsMobileSidebarOpen(false);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const logout = async () => {
        try {
            setLogoutLoading(true);
            await supabase.auth.signOut();
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            setLogoutLoading(false);
        }
    };

    if (langLoading) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" text={t("switchingLanguage")} />
        </div>
    );
    if (loadingTasks) return (
        <div className="flex items-center justify-center h-screen">
            <LoadingSpinner size="lg" text={t("loadingTasks")} />
        </div>
    );
    if (logoutLoading)
        return (
            <div className="flex items-center justify-center h-screen">
                <LoadingSpinner size="lg" text={t("loggingOut")} />
            </div>
        );

    return (
        <div className="flex flex-col md:flex-row h-screen bg-gray-100 relative overflow-hidden">

            {/* Hamburger Icon for Mobile */}
            <button
                className="absolute top-4 left-4 z-30 md:hidden bg-white/80 rounded p-2 shadow"
                onClick={() => setIsMobileSidebarOpen(true)}
                aria-label="Open sidebar"
            // style={{ display: isMobileSidebarOpen ? "none" : "block" }}
            >
                <HamburgerIcon />
            </button>

            {/* ---------- Sidebar ---------- */}
            <aside
                className={`
                    h-screen flex flex-col bg-gradient-to-b from-sky-500 to-sky-700 text-white transition-all duration-200
                    ${isSidebarOpen ? "w-64" : "w-16"} shrink-0 shadow-lg
                    ${isMobileSidebarOpen ? "fixed inset-0 z-40 w-64" : "md:static"}
                    ${isMobileSidebarOpen ? "block" : "hidden md:flex"}
                `}
                style={isMobileSidebarOpen ? { minWidth: "16rem" } : {}}
            >
                {/* Close button for mobile sidebar */}
                <button
                    className="absolute top-4 right-4 z-50 md:hidden bg-white/80 rounded p-2 shadow"
                    onClick={() => setIsMobileSidebarOpen(false)}
                    aria-label="Close sidebar"
                    style={{ display: isMobileSidebarOpen ? "block" : "none" }}
                >
                    <CloseIcon />
                </button>
                {/* ...existing sidebar content... */}
                {/* Header */}
                <div className={`px-4 py-5 flex items-center ${isSidebarOpen ? "gap-2 justify-start" : "justify-center"} transition-all`}>
                    <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/15 text-lg font-bold">
                        TM
                    </div>
                    {isSidebarOpen && (
                        <h1 className="text-lg font-bold tracking-tight">{t("appName")}</h1>
                    )}
                </div>
                {/* ...rest of sidebar unchanged... */}
                {/* Create Task */}
                <div className="px-4">
                    <button
                        onClick={() => setShowModal(true)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium shadow-sm
            ${isSidebarOpen ? "justify-start" : "justify-center"} bg-white text-sky-700 hover:bg-sky-50`}
                        title={!isSidebarOpen ? t("createTask") : ""}
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                            <path d="M12 5v14M5 12h14" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className={`${isSidebarOpen ? "inline" : "hidden"}`}> {t("createTask")}</span>
                    </button>
                </div>
                {/* Navigation */}
                <nav className="mt-6 px-2 flex-1 overflow-y-auto pb-32">
                    {[
                        { key: "all", label: t("tasks"), icon: <ListIcon /> },
                        { key: "todo", label: t("todo"), icon: <ClockIcon /> },
                        { key: "in-progress", label: t("inProgress"), icon: <SpinnerIcon /> },
                        { key: "completed", label: t("completed"), icon: <CheckIcon /> },
                    ].map(item => (
                        <button
                            key={item.key}
                            onClick={() => {
                                setFilter(item.key);
                                if (isMobileSidebarOpen) setIsMobileSidebarOpen(false);
                            }}
                            className={`group w-full flex items-center gap-3 text-left px-3 py-2 rounded-md transition-colors mb-1
              ${filter === item.key ? "bg-white/20" : "hover:bg-white/10"}`}
                            title={!isSidebarOpen ? item.label : ""}
                        >
                            <div className="w-6 h-6 flex items-center justify-center text-white/90">{item.icon}</div>
                            <span className={`${isSidebarOpen ? "inline" : "hidden"} font-medium`}>{item.label}</span>
                        </button>
                    ))}
                </nav>
                {/* Footer */}
                <div className="px-4 py-4 border-t border-white/10 flex flex-col items-center bg-gradient-to-t from-sky-700 to-transparent shrink-0">
                    {/* Profile */}
                    <div className={`flex items-center mb-3 ${isSidebarOpen ? "flex-row gap-3" : "flex-col"} transition-all`}>
                        <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center text-white font-semibold">
                            {profile?.full_name
                                ? profile.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
                                : "DG"}
                        </div>
                        {isSidebarOpen && (
                            <div className="text-left">
                                <div className="text-sm font-semibold">{t(profile?.full_name || "User")}</div>
                                <div className="text-xs opacity-80">{t("productivity")}</div>
                            </div>
                        )}
                    </div>
                    {/* Buttons */}
                    <div className={`flex w-full ${isSidebarOpen ? "flex-row gap-2 items-center" : "flex-col items-center gap-3"} transition-all`}>
                        <button
                            onClick={logout}
                            className={`${isSidebarOpen ? "flex-1 px-3 py-2 text-sm" : "w-10 h-10 flex items-center justify-center"} rounded-md bg-red-500 hover:bg-red-600 text-white`}
                            title={!isSidebarOpen ? "Logout" : ""}
                        >
                            {isSidebarOpen ? t("logout") : <LogoutIcon />}
                        </button>
                        <button
                            onClick={() => {
                                setIsSidebarOpen(s => !s)
                                if (isMobile) {
                                    setIsMobileSidebarOpen(false)
                                    setIsSidebarOpen(true)
                                }
                            }}
                            className="w-10 h-10 rounded-md bg-white/15 hover:bg-white/25 flex items-center justify-center"
                            title={isSidebarOpen ? "Collapse" : "Expand"}
                        >
                            {isSidebarOpen ? <CollapseIcon /> : <ExpandIcon />}
                        </button>
                    </div>
                </div>
            </aside>

            {/* ---------- Main Content ---------- */}
            <div className="flex-1 flex flex-col min-h-0">
                {/* Top Navbar */}
                <header className="flex justify-between items-center bg-white shadow p-4 gap-4 flex-wrap">
                    <div className="flex gap-2 flex-wrap items-center">
                        {/* Search */}
                        <div className="relative max-w-xs w-full sm:w-auto">
                            <input
                                type="text"
                                placeholder={t("searchPlacehold")}
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="border rounded pl-10 pr-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            <svg className="w-5 h-5 absolute left-3 top-[9px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                            </svg>
                        </div>
                        {/* Priority */}
                        <select
                            value={filterPriority}
                            onChange={e => setFilterPriority(e.target.value)}
                            className="border rounded px-3 py-2 max-w-xs w-full sm:w-auto leading-relaxed font-[Noto_Sans_Devanagari] focus:outline-none focus:ring-2 focus:ring-sky-500"
                            style={{ lineHeight: "2", overflow: "visible" }}
                        >
                            <option value="">{t("allPriorities")}</option>
                            <option value="high">{t("high")}</option>
                            <option value="medium">{t("medium")}</option>
                            <option value="low">{t("low")}</option>
                        </select>
                        {/* Date */}
                        {/* <input
                            type="date"
                            value={filterDate}
                            onChange={e => setFilterDate(e.target.value)}
                            className="border rounded px-3 py-2 max-w-xs w-full sm:w-auto leading-relaxed font-[Noto_Sans_Devanagari] focus:outline-none focus:ring-2 focus:ring-sky-500"
                        /> */}
                    </div>
                    {/* Right Section */}
                    <div className="flex items-center gap-4">
                        <LanguageSwitcher variant="dashboard" setLangLoading={setLangLoading} className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500" />
                        {/* User Initials */}
                        {!isSidebarOpen && (
                            <span
                                className={`font-semibold text-white rounded-full bg-sky-600 flex items-center justify-center transition-all
              ${isSidebarOpen ? "px-3 py-1 text-sm" : "w-10 h-10 text-base"}`}
                                title={isSidebarOpen ? profile?.full_name : ""}
                            >
                                {profile?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase() || ""}
                            </span>
                        )}
                        {/* Logout only when expanded */}
                        {!isSidebarOpen && (
                            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded">
                                {t("logout")}
                            </button>
                        )}
                    </div>
                </header>
                {/* Main Task Board */}
                <main className="flex-1 overflow-y-auto p-6 min-h-0">
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
            {/* Create Task Modal */}
            {showModal && (
                <CreateTaskModal
                    onClose={() => setShowModal(false)}
                    setTasks={setTasks}
                    user={user}
                    setIsMobileSidebarOpen={setIsMobileSidebarOpen} // <-- add this
                />
            )}
        </div>
    );
}

/* ---------- Icons ---------- */
function ListIcon() {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M8 6h11M8 12h11M8 18h11M3 6h.01M3 12h.01M3 18h.01" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function ClockIcon() {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M12 7v6l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" /></svg>;
}
function SpinnerIcon() {
    return <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none"><path d="M21 12a9 9 0 10-9 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>;
}
function CheckIcon() {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function LogoutIcon() {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><path d="M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /><path d="M13 19H7a2 2 0 01-2-2V7a2 2 0 012-2h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function CollapseIcon() {
    return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function ExpandIcon() {
    return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
function HamburgerIcon() {
    return (
        <svg className="w-6 h-6 text-sky-700" fill="none" viewBox="0 0 24 24">
            <rect x="4" y="6" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="11" width="16" height="2" rx="1" fill="currentColor" />
            <rect x="4" y="16" width="16" height="2" rx="1" fill="currentColor" />
        </svg>
    );
}
function CloseIcon() {
    return (
        <svg className="w-6 h-6 text-sky-700" fill="none" viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}
