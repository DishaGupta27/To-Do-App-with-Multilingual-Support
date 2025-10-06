// TaskBoard.jsx
import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ReadMoreModal from "./ReadMoreModal";
import TaskCard from "./TaskCard";

export default function TaskBoard({
    tasks,
    setTasks,
    searchTerm = "",
    filterPriority = "",
    filterDate = "",
    filter = "all",
}) {
    const { t, i18n } = useTranslation();
    const [selectedTask, setSelectedTask] = useState(null);

    // Filtering logic
    const filteredTasks = tasks.filter((task) => {
        const s = searchTerm?.toLowerCase() || "";
        const titleMatch = task.title?.toLowerCase().includes(s);
        const notesMatch = task.notes?.toLowerCase().includes(s);
        const priorityMatch = filterPriority ? task.priority === filterPriority : true;
        const dateMatch = filterDate
            ? new Date(task.created_at).toISOString().split("T")[0] === filterDate
            : true;
        return (titleMatch || notesMatch) && priorityMatch && dateMatch;
    });

    const statuses = filter === "all" ? ["todo", "in-progress", "completed"] : [filter];

    // Supabase actions
    const deleteTask = async (id) => {
        await supabase.from("tasks").delete().eq("id", id);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    };

    const toggleStatus = async (task, newStatus) => {
        const { data, error } = await supabase
            .from("tasks")
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq("id", task.id)
            .select("*");

        if (!error && data?.length) {
            setTasks((prev) => prev.map((t) => (t.id === task.id ? data[0] : t)));
            if (selectedTask?.id === task.id) setSelectedTask(data[0]);
        }
    };

    const editTask = async (taskId, updatedFields) => {
        if (
            !updatedFields.title?.trim() ||
            !updatedFields.notes?.trim() ||
            !updatedFields.priority?.trim()
        ) {
            console.error("Edit failed: All fields are required.");
            return;
        }

        const { data, error } = await supabase
            .from("tasks")
            .update({
                title: updatedFields.title.trim(),
                notes: updatedFields.notes.trim(),
                priority: updatedFields.priority.toLowerCase(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", taskId)
            .select("*");

        if (!error && data?.length) {
            setTasks((prev) => prev.map((t) => (t.id === taskId ? data[0] : t)));
            if (selectedTask?.id === taskId) setSelectedTask(data[0]);
            return data[0];
        } else if (error) {
            console.error("Failed to edit task:", error);
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;
        if (!destination) return;
        if (source.droppableId === destination.droppableId && source.index === destination.index)
            return;

        const draggedTaskId = draggableId;
        const newStatus = destination.droppableId;

        setTasks((prev) =>
            prev.map((task) =>
                task.id === draggedTaskId ? { ...task, status: newStatus } : task
            )
        );

        await supabase
            .from("tasks")
            .update({
                status: newStatus,
                updated_at: new Date().toISOString(),
            })
            .eq("id", draggedTaskId);
    };

    return (
        <>
            <DragDropContext onDragEnd={handleDragEnd}>
                <div
                    className={`w-full grid gap-6 ${filter === "all"
                            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                            : "grid-cols-1"
                        }`}
                >
                    {statuses.map((status) => {
                        const statusTasks = filteredTasks.filter((t) => t.status === status);
                        return (
                            <Droppable droppableId={status} key={status}>
                                {(provided, snapshot) => (
                                    <section
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm min-h-[120px] transition-all duration-200 ${snapshot.isDraggingOver
                                                ? "ring-2 ring-blue-400"
                                                : ""
                                            }`}
                                    >
                                        <h3 className="text-lg font-semibold mb-3 flex items-center justify-between text-gray-800 dark:text-gray-200 capitalize">
                                            <span>
                                                {status === "todo"
                                                    ? t("todo")
                                                    : status === "in-progress"
                                                        ? t("inProgress")
                                                        : t("completed")}
                                            </span>
                                            <span className="text-sm text-slate-500 dark:text-gray-400">
                                                {statusTasks.length}
                                            </span>
                                        </h3>

                                        <div className="space-y-4">
                                            {statusTasks.length > 0 ? (
                                                statusTasks.map((task, index) => (
                                                    <Draggable
                                                        draggableId={task.id}
                                                        index={index}
                                                        key={task.id}
                                                    >
                                                        {(provided) => (
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            >
                                                                <TaskCard
                                                                    task={task}
                                                                    deleteTask={deleteTask}
                                                                    toggleStatus={toggleStatus}
                                                                    editTask={editTask}
                                                                    setSelectedTask={setSelectedTask}
                                                                    t={t}
                                                                    lang={i18n.language}
                                                                />
                                                            </div>
                                                        )}
                                                    </Draggable>
                                                ))
                                            ) : (
                                                <div className="text-center text-slate-400 py-8 border border-dashed rounded-md">
                                                    {t("NoTasks")}
                                                </div>
                                            )}
                                        </div>
                                        {provided.placeholder}
                                    </section>
                                )}
                            </Droppable>
                        );
                    })}
                </div>
            </DragDropContext>

            {selectedTask && (
                <ReadMoreModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                    editTask={editTask}
                    t={t}
                    lang={i18n.language}
                />
            )}
        </>
    );
}
