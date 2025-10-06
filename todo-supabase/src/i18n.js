import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
    en: {
        translation: {
            appName: "Task Manager",
            productivity: "Productivity",
            loading: "Loading",
            loadingTasks: "Loading Tasks",
            loggingOut: "LoggingOut",
            switchingLanguage: "SwitchingLanguage",
            DonthaveanAccount: "Don't have an Account?",
            AlreadyhaveanAccount: "Already have an Account ?",
            name: "Full Name",
            datePlaceholder: "Select Date",
            created: "Created",
            updated: "Updated",
            dashboard: "Dashboard",
            logout: "Logout",
            addTask: "Add Task",
            createTask: "Create Task",
            tasks: "Tasks",
            inProgress: "In Progress",
            complete: "Complete",
            progress: "Progress",
            todo: "ToDo",
            completed: "Completed",
            delete: "Delete",
            edit: "Edit",
            save: "Save",
            cancel: "Cancel",
            close: "Close",
            createdAt: "Created At",
            updatedAt: "Updated At",
            search: "Search...",
            searchPlacehold: "Search...",
            allPriorities: "All Priorities",
            high: "High",
            medium: "Medium",
            low: "Low",
            priority: "Priority",
            allFieldsRequired: "All fields are required",
            email: "Email",
            password: "Password",
            login: "Login",
            signup: "Signup",
            notes: "Notes",
            title: "Title",
            readMore: "Read More",
            datePlaceholder: "Select Date",
            NoTasks: "No Tasks"
        },
    },
    hi: {
        translation: {
            appName: "कार्य प्रबंधक",
            productivity: "उत्पादकता",
            DonthaveanAccount: "क्या आपके पास खाता नहीं है?",
            AlreadyhaveanAccount: "क्या आपके पास पहले से एक खाता मौजूद है ?",
            loading: "लोड हो रहा है",
            loadingTasks: " कार्य लोड हो रहा है",
            loggingOut: "लॉग आउट",
            switchingLanguage: "भाषा परिवर्तन",
            name: "पूरा नाम",
            datePlaceholder: "तारीख चुनें",
            created: "निर्माण तिथि",
            updated: "अद्यतन तिथि",
            dashboard: "डैशबोर्ड",
            logout: "लॉगआउट",
            addTask: "कार्य जोड़ें",
            createTask: "कार्य बनाएँ",
            tasks: "सभी कार्य",
            inProgress: "प्रगति पर",
            complete: "पूर्ण करें",
            progress: "प्रगति",
            todo: "करना है",
            completed: "पूर्ण हुआ",
            delete: "हटाएँ",
            edit: "संपादित करें",
            save: "सहेजें",
            cancel: "रद्द करें",
            close: "बंद करें",
            createdAt: "बनाया गया",
            updatedAt: "अद्यतन किया गया",
            search: "खोजें...",
            searchPlacehold: "खोजें...",
            allPriorities: "सभी प्राथमिकताएँ",
            high: "उच्च",
            medium: "मध्यम",
            low: "निम्न",
            priority: "प्राथमिकता",
            allFieldsRequired: "सभी फ़ील्ड आवश्यक हैं",
            email: "ईमेल",
            password: "पासवर्ड",
            login: "लॉगिन",
            signup: "साइनअप",
            notes: "नोट्स",
            title: "शीर्षक",
            readMore: "अधिक पढ़ें",
            datePlaceholder: "तारीख चुनें",
            NoTasks: "कोई कार्य नहीं"
        },
    },
};

const storedLang = localStorage.getItem("lang") || "en";

i18n.use(initReactI18next).init({
    resources,
    lng: storedLang,
    fallbackLng: "en",
    interpolation: { escapeValue: false },
});

window.addEventListener("storage", (e) => {
    if (e.key === "lang" && e.newValue) {
        i18n.changeLanguage(e.newValue);
    }
});

export default i18n;
