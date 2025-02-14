import React, { useEffect, useState } from "react";

const Instructions = () => {
    const [tasks, setTasks] = useState([]);
    const [progress, setProgress] = useState(null);
    const [width, setWidth] = useState(400);

    const fetchTasks = () => {
        fetch("http://localhost:8080/tasks")
            .then((response) => response.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error("Error fetching tasks:", error));
    };

    const fetchProgress = () => {
        fetch("http://localhost:8080/progress")
            .then((response) => response.json())
            .then((data) => setProgress(data))
            .catch((error) => console.error("Error fetching progress:", error));
    };

    useEffect(() => {
        fetchTasks();
        fetchProgress();
    }, []);

    const toggleTaskCompletion = (taskId, isCompleted) => {
        const url = isCompleted
            ? `http://localhost:8080/tasks/${taskId}/uncheck`
            : `http://localhost:8080/tasks/${taskId}/complete`;

        fetch(url, { method: "PUT" })
            .then((response) => response.json())
            .then(() => {
                setTasks((prevTasks) =>
                    prevTasks.map((task) =>
                        task.id === taskId ? { ...task, isCompleted: !isCompleted } : task
                    )
                );
                fetchProgress();
            })
            .catch((error) => console.error("Error updating task:", error));
    };

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = width;

        const handleMouseMove = (moveEvent) => {
            const newWidth = startWidth + (moveEvent.clientX - startX);
            setWidth(newWidth > 300 ? newWidth : 300);
        };

        const handleMouseUp = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div style={{ ...styles.container, width: `${width}px` }}>
            <div style={styles.header}>
                <h1 style={styles.title}>Galaga course</h1>
                {progress && (
                    <div style={styles.progressBar}>
                        <div style={{ ...styles.progressFill, width: `${progress.progress}%` }} />
                    </div>
                )}
            </div>

            <div style={styles.content}>
                <div style={styles.documentHeader}>
                    <div style={styles.headerDecoration} />
                    <h2 style={styles.subtitle}>Instructions</h2>
                    <div style={styles.headerDecoration} />
                </div>

                <div style={styles.taskList}>
                    {tasks.map((task, index) => (
                        <React.Fragment key={task.id}>
                            <div style={styles.taskItem}>
                                <button
                                    style={{
                                        ...styles.checkButton,
                                        backgroundColor: task.isCompleted ? "#4CAF50" : "#2E4D66",
                                    }}
                                    onClick={() => toggleTaskCompletion(task.id, task.isCompleted)}
                                >
                                    {task.isCompleted ? "✓" : ""}
                                </button>
                                <div style={styles.taskContentWrapper}>
                                    <span style={styles.taskNumber}>{index + 1}.</span>
                                    <span
                                        style={{
                                            ...styles.taskText,
                                            color: task.isCompleted ? "#888" : "#D8DEE9",
                                            backgroundColor: task.isCompleted ? "transparent" : "#2E4D66",
                                        }}
                                    >
                                        {task.text}
                                    </span>
                                </div>
                            </div>
                            {index < tasks.length - 1 && <div style={styles.taskSeparator} />}
                        </React.Fragment>
                    ))}
                </div>
            </div>
            <div style={styles.resizeHandle} onMouseDown={handleMouseDown} />
        </div>
    );
};

const styles = {
    container: {
        minWidth: "300px",
        backgroundColor: "#192734",
        color: "#D8DEE9",
        overflow: "hidden",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    header: {
        backgroundColor: "#233545",
        padding: "20px",
        borderBottom: "2px solid #1E2A38",
    },
    title: {
        margin: 0,
        color: "#88C0D0",
        fontSize: "24px",
        fontWeight: "500",
        textAlign: "center",
    },
    progressBar: {
        width: "100%",
        height: "8px",
        backgroundColor: "#37444F",
        borderRadius: "4px",
        marginTop: "10px",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        backgroundColor: "#4CAF50",
        transition: "width 0.3s ease-in-out",
    },
    content: {
        padding: "20px",
        maxHeight: "500px",
        overflowY: "auto",
    },
    documentHeader: {
        display: "flex",
        alignItems: "center",
        gap: "15px",
        marginBottom: "25px",
    },
    headerDecoration: {
        flex: 1,
        height: "2px",
        backgroundColor: "#2E4D66",
    },
    subtitle: {
        color: "#88C0D0",
        fontSize: "20px",
        margin: 0,
        whiteSpace: "nowrap",
    },
    taskList: {
        display: "flex",
        flexDirection: "column",
    },
    taskItem: {
        backgroundColor: "#233545",
        borderRadius: "6px",
        padding: "15px",
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
    },
    taskContentWrapper: {
        flex: 1,
        display: "flex",
        gap: "10px",
        alignItems: "flex-start",
    },
    taskNumber: {
        color: "#88C0D0",
        minWidth: "20px",
        paddingTop: "2px",
    },
    checkButton: {
        width: "24px",
        height: "24px",
        borderRadius: "50%",
        border: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        cursor: "pointer",
        transition: "background-color 0.2s ease",
        flexShrink: 0,
    },
    taskText: {
        flex: 1,
        fontSize: "16px",
        padding: "2px 8px",
        borderRadius: "4px",
        lineHeight: "1.5",
    },
    taskSeparator: {
        height: "1px",
        backgroundColor: "#2E4D66",
        margin: "10px 0",
    },
    resizeHandle: {
        width: "10px",
        cursor: "ew-resize",
        backgroundColor: "#2E4D66",
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
    },
};

export default Instructions;
