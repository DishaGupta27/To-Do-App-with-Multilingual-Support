import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useTranslation } from "react-i18next";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ReadMoreModal from "./ReadMoreModal";
import TaskCard from "./TaskCard";

export default function TaskBoard({
    tasks,
    setTasks,
    searchTerm,
    filterPriority,
    filterDate,
    filter,
}) {
    const { t, i18n } = useTranslation();
    const [selectedTask, setSelectedTask] = useState(null);

    const filteredTasks = tasks.filter((task) => {
        const searchMatch =
            task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.notes?.toLowerCase().includes(searchTerm.toLowerCase());
        const priorityMatch = filterPriority
            ? task.priority === filterPriority
            : true;
        const dateMatch = filterDate
            ? new Date(task.created_at).toISOString().split("T")[0] === filterDate
            : true;
        return searchMatch && priorityMatch && dateMatch;
    });

    const statuses = filter === "all" ? ["todo", "in-progress", "completed"] : [filter];

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
            setTasks((prev) =>
                prev.map((t) => (t.id === task.id ? data[0] : t))
            );
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
            setTasks((prev) =>
                prev.map((t) => (t.id === taskId ? data[0] : t))
            );
            if (selectedTask?.id === taskId) setSelectedTask(data[0]);
            return data[0];
        } else if (error) {
            console.error("Failed to edit task:", error);
        }
    };

    const handleDragEnd = async (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        if (
            source.droppableId === destination.droppableId &&
            source.index === destination.index
        )
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
                    className={`grid gap-4 ${filter === "all"
                        ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                        : "grid-cols-1"
                        }`}
                >
                    {statuses.map((status) => (
                        <Droppable droppableId={status} key={status}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className={`bg-gray-100 dark:bg-gray-800 p-4 rounded shadow flex flex-col transition-all duration-200 ${snapshot.isDraggingOver
                                        ? "ring-2 ring-blue-400"
                                        : ""
                                        }`}
                                >
                                    <h2 className="text-lg font-bold mb-2 capitalize text-gray-800 dark:text-gray-200">
                                        {status === "todo"
                                            ? t("todo")
                                            : status === "in-progress"
                                                ? t("inProgress")
                                                : t("completed")}
                                    </h2>

                                    {filteredTasks.filter(
                                        (task) => task.status === status
                                    ).length > 0 ? (
                                        filteredTasks
                                            .filter(
                                                (task) => task.status === status
                                            )
                                            .map((task, index) => (
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
                                                                setSelectedTask={
                                                                    setSelectedTask
                                                                }
                                                                t={t}
                                                                lang={i18n.language}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                    ) : (
                                        <div className="text-center text-gray-400 border border-dashed border-gray-300 p-4 rounded">
                                            {t("NoTasks")}
                                        </div>
                                    )}

                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
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
