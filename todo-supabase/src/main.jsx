import React from "react";          // <-- ADD THIS
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";
import "./i18n"; // Initialize i18n

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="bottom-center"
      reverseOrder={false}
      toastOptions={{
        duration: 800,
        success: {
          style: {
            background: "#10B981",
            color: "#fff",
          },
        },
        error: {
          style: {
            background: "#EF4444",
            color: "#fff",
          },
        },
      }}
    />

  </StrictMode>
);
