import React from "react";

export default function SkeletonDashboard() {
    return (
        <div className="flex h-screen bg-gray-100 animate-pulse">
            {/* Sidebar Skeleton */}
            <aside className="w-64 bg-gradient-to-b from-sky-500 to-sky-700 text-white flex flex-col p-4 space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 rounded-md"></div>
                    <div className="h-4 w-24 bg-white/30 rounded"></div>
                </div>
                <div className="h-8 bg-white/25 rounded mt-2"></div>

                <div className="space-y-3 mt-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-6 h-6 bg-white/25 rounded"></div>
                            <div className="h-4 w-32 bg-white/25 rounded"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-auto space-y-3 border-t border-white/20 pt-4">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-white/25"></div>
                        <div className="space-y-2">
                            <div className="h-3 w-20 bg-white/25 rounded"></div>
                            <div className="h-3 w-12 bg-white/25 rounded"></div>
                        </div>
                    </div>
                    <div className="h-8 bg-white/25 rounded"></div>
                </div>
            </aside>

            {/* Main Content Skeleton */}
            <div className="flex-1 flex flex-col">
                {/* Header */}
                <header className="bg-white shadow p-4 flex justify-between items-center">
                    <div className="flex space-x-3">
                        <div className="h-8 w-48 bg-gray-200 rounded"></div>
                        <div className="h-8 w-32 bg-gray-200 rounded"></div>
                        <div className="h-8 w-28 bg-gray-200 rounded"></div>
                    </div>
                    <div className="flex space-x-3">
                        <div className="h-8 w-28 bg-gray-200 rounded"></div>
                        <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
                        <div className="h-8 w-20 bg-gray-200 rounded"></div>
                    </div>
                </header>

                {/* Task Columns */}
                <main className="p-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className="bg-white rounded-lg shadow-sm p-4 min-h-[300px]"
                        >
                            <div className="h-5 w-32 bg-gray-200 rounded mb-4"></div>
                            <div className="space-y-4">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="border border-gray-200 rounded-lg p-3 space-y-2"
                                    >
                                        <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                                        <div className="h-3 w-full bg-gray-200 rounded"></div>
                                        <div className="h-3 w-2/3 bg-gray-200 rounded"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </main>
            </div>
        </div>
    );
}
