
import React from "react";

export default function TaskSkeleton() {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md animate-pulse space-y-3">
            <div className="h-5 bg-gray-300 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
                <div className="h-6 w-16 bg-gray-300 rounded"></div>
            </div>
        </div>
    );
}
