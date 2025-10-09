# To-Do App with Multilingual Support

A modern, responsive To-Do application built with React, Supabase, and Tailwind CSS. Features include multilingual support (English/Hindi), drag-and-drop task management, authentication, and a mobile-friendly UI.

---

## 🚀 Live Demo & Repository

- **GitHub Repo:** [https://github.com/DishaGupta27/To-Do-App-with-Multilingual-Support](https://github.com/DishaGupta27/To-Do-App-with-Multilingual-Support)
- **Live App (Vercel):** [https://to-do-app-with-multilingual-support.vercel.app/](https://to-do-app-with-multilingual-support.vercel.app/)

---

## ✨ Features

- 🔒**Authentication:** Email/password signup, login, logout (Supabase)
- 📝**Tasks:** Add, edit, delete, toggle complete; only see your own tasks
- 📋**Fields:** Title, Notes, Status, Created/Updated timestamps, User ID
- 🌐**Multilingual:** English + Hindi, language switcher, persistent preference, all UI strings localized
- 🎨**UI/UX:** Clean, responsive, mobile-friendly, with proper loading, empty, and error states
- 🔍**Search & Filter:** Quickly find and filter tasks by priority, status, or text
- 📱**Dashboard View:** Tasks grouped by status (Todo, In Progress, Completed)
- 🟦**Drag-and-Drop:** Reorder tasks visually
- 🏷️**Reusable Components:** Modular, maintainable codebase

---

## 🛠️ Tech Stack

- [React](https://react.dev/)
- [Supabase](https://supabase.com/) (Auth & Database)
- [Tailwind CSS](https://tailwindcss.com/)
- [i18next](https://www.i18next.com/) (Internationalization)
- [@hello-pangea/dnd](https://github.com/hello-pangea/dnd) (Drag-and-drop)

---

## 🗄️ Supabase Schema & RLS Policies

### `tasks` Table

```sql
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  title text not null,
  notes text not null,
  priority text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone
);
```

### `profiles` Table

```sql
create table profiles (
  id uuid primary key references auth.users,
  full_name text
);
```

### Row Level Security (RLS) Policies

```sql
-- Enable RLS
alter table tasks enable row level security;

-- Allow users to access only their own tasks
create policy "Users can access their own tasks"
  on tasks for all
  using (auth.uid() = user_id);

-- Enable RLS for profiles
alter table profiles enable row level security;

-- Allow users to access/update their own profile
create policy "Users can access their own profile"
  on profiles for all
  using (auth.uid() = id);
```

---

## 📷 Video Walkthrough 

[![Watch the video walkthrough](https://img.shields.io/badge/Watch%20Video-%F0%9F%93%B7-blue?style=for-the-badge)](https://www.awesomescreenshot.com/video/45118055?key=b73f447d5fadea8de9cefaa478fdbc3c)  
  [Video Walkthrough Of The Project](https://www.awesomescreenshot.com/video/45118055?key=b73f447d5fadea8de9cefaa478fdbc3c)

---


## 🧑‍💻 Getting Started

1. **Clone the repository:**
    ```bash
    git clone https://github.com/DishaGupta27/To-Do-App-with-Multilingual-Support.git
    cd To-Do-App-with-Multilingual-Support/todo-supabase
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Configure Supabase:**
    - Create a project at [Supabase](https://supabase.com/).
    - Set up the tables and RLS policies as above.
    - Add your Supabase URL and anon key to a `.env` file:
      ```
      VITE_SUPABASE_URL=your_supabase_url
      VITE_SUPABASE_ANON_KEY=your_anon_key
      ```

4. **Run the app locally:**
    ```bash
    npm run dev
    ```

---

## 📁 Project Structure

```
todo-supabase/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── DashboardLayout.jsx
│   │   ├── TaskBoard.jsx
│   │   ├── TaskCard.jsx
│   │   ├── CreateTaskModal.jsx
│   │   ├── LanguageSwitcher.jsx
│   │   └── ...
│   ├── lib/
│   │   └── supabaseClient.js
│   ├── utils/
│   ├── i18n.js
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── tailwind.config.js
└── ...
```

---
