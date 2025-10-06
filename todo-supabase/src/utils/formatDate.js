// src/utils/formatDate.js
export function formatDate(dateString, locale = "en-IN") {
    if (!dateString) return "";

    // ✅ Ensure UTC by appending Z if missing
    const safeString = dateString.endsWith("Z") ? dateString : dateString + "Z";
    const date = new Date(safeString);

    // 🔍 Debugging
    console.log("🕒 Raw dateString:", dateString);
    console.log("🕒 SafeString (forced UTC):", safeString);
    console.log("🕒 JS Date.toString():", date.toString());
    console.log("🕒 JS Date.toISOString():", date.toISOString());

    return date.toLocaleString(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Kolkata", // ✅ Always IST
    });
}
