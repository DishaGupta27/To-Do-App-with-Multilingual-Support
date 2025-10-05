import { useEffect, useState } from "react";
import React from "react";
import { supabase } from "../lib/supabaseClient";
import DashboardLayout from "../components/DashboardLayout";
import TaskBoard from "../components/TaskBoard";
import CreateTaskModal from "../components/CreateTaskModal";


export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchTasks();
    }, []);

    async function fetchTasks() {
        const { data, error } = await supabase
            .from("tasks")
            .select("*")
            .order("created_at", { ascending: false });

        if (!error) setTasks(data);
    }

    return (
        <DashboardLayout onCreateTask={() => setShowModal(true)}>
            <TaskBoard tasks={tasks} onTaskUpdated={fetchTasks} />
            {showModal && (
                <CreateTaskModal
                    onClose={() => setShowModal(false)}
                    onTaskCreated={fetchTasks}
                />
            )}
        </DashboardLayout>
    );
}
