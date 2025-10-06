
import React from "react";

export default function LoadingSpinner({ size = "md", text }) {
    const spinnerSize =
        size === "sm" ? "h-4 w-4" : size === "lg" ? "h-10 w-10" : "h-6 w-6";

    return (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`animate-spin rounded-full border-4 border-blue-500 border-t-transparent ${spinnerSize}`}
            ></div>
            {text && <p className="mt-2 text-gray-600 text-sm">{text}</p>}
        </div>
    );
}
