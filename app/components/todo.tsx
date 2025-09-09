"use client"
import { useEffect, useRef, useState } from "react";
import { MdEdit, MdDelete, MdSave, MdClear } from "react-icons/md";
import { useTranslation } from "react-i18next";

interface ToDoProps {
    todoId: number;
    text: string;
    done: boolean;
    listColor: string;
    listId: number;
    editingTodoId: number | null;
    setEditingTodoId: React.Dispatch<React.SetStateAction<number | null>>;
    dispatch: React.Dispatch<any>;    
}

// Add more if needed
const defaultErrors = {
    error_1: false,
};

export default function ToDo({ todoId, text, done, listColor, listId, editingTodoId, setEditingTodoId, dispatch }: ToDoProps) {

    const { t } = useTranslation();
    const [showTodoEditError, setShowTodoEditError] = useState(defaultErrors);
    const [newText, setNewText] = useState<string>(text);
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    const [shouldRender, setShouldRender] = useState(showAlert);
    const deleteTodoRef = useRef<HTMLDivElement>(null);

    const isEditing = editingTodoId === todoId;

    useEffect(() => {

        // If the click target is not inside the modal, close it
        const handleModalClickOutside = (event: MouseEvent) => {
            if (deleteTodoRef.current && !deleteTodoRef.current.contains(event.target as Node)) {
                setShowAlert(false);
            }
        };

        // If the modal is visible, add a 'mousedown' event listener
        if (showAlert) {
            document.addEventListener('mousedown', handleModalClickOutside);
            setShouldRender(true);
        } else {
            // Delay unmount for the duration of the fade-out
            const timeout = setTimeout(() => setShouldRender(false), 300); // Match Tailwind duration
            return () => clearTimeout(timeout);
        }

        // Clean up function to remove the 'mousedown' event listener
        return () => {
            document.removeEventListener('mousedown', handleModalClickOutside);
        };

    }, [showAlert]);

    const handleEdit = () => {

        if (newText.trim().length < 1) {
            setShowTodoEditError(((prev) => ({ ...prev, error_1: true })));
            return;
        }

        dispatch({
            type: 'edit_todo',
            listId,
            todo: {
                todoId,
                text: newText,
                done: false
            }
        })
        setEditingTodoId(null);
    }

    const handleCancel = () => {
        setNewText(text);
        setEditingTodoId(null);
        setShowTodoEditError(defaultErrors);
    }

    return (
        <>
            <div className="inline-flex justify-between relative">
                <div className="inline-flex items-start">
                    <input
                        type="checkbox"
                        onChange={() => dispatch({ type: 'toggle_todo', listId, todoId })}
                        checked={done}
                        style={{ accentColor: `#${listColor}` }}
                        className="mt-[5px]" />
                    {isEditing ? (
                        <textarea
                            name="edit-field"
                            value={newText}
                            onChange={(e) => {
                                setNewText(e.target.value);
                                if (showTodoEditError) setShowTodoEditError(defaultErrors);
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEdit();
                            }}
                            rows={4}
                            cols={20}
                            className={`ml-2 pl-1 break-words max-w-[225px] text-lg z-10 relative bg-transparent resize-none focus:outline-none border border-black ${done
                                ? "text-gray-500 dark:text-gray-300"
                                : "text-black dark:text-white"
                                }`}
                        />
                    ) : (
                        <div className="relative inline-flex items-center justify-center flex-wrap ml-1">
                            <span
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className={`${done ? "text-gray-500 dark:text-gray-300 line-through decoration-[var(--dynamic-color)]" : "text-black dark:text-white"} break-words max-w-[225px] text-lg pl-1 z-10 relative`}
                            >
                                {text}
                            </span>
                        </div>
                    )}
                </div>
                <div className="inline-flex flex-nowrap">
                    {isEditing ? (
                        <>
                            <button
                                type="button"
                                onClick={handleEdit}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdSave />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCancel()}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdClear />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setEditingTodoId(todoId)}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdEdit />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAlert(true)}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdDelete />
                            </button>
                        </>
                    )}
                </div>
            </div>
            {isEditing ? (
                <>
                    <div>
                        {showTodoEditError.error_1 && (
                            <p className="text-red-500 dark:text-red-400 text-sm ml-5 mt-1">{t("alert_todo_1")}</p>
                        )}
                    </div>
                </>
            ) : (
                <></>
            )}
            <div className="relative">
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col justify-center items-center transform transition-all duration-300
                              ${showAlert ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none -translate-x-1/2 -translate-y-1/2'}`}
                >
                    {shouldRender && (
                        <div ref={deleteTodoRef}
                            style={{ boxShadow: `7px 7px #${listColor}` }}
                            className="border bg-white dark:bg-[#5a5a5a] shadow-lg rounded"
                        >
                            <div className="flex flex-row justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAlert(false)}
                                    className="text-black dark:text-white hover:text-[#ffe97a] transition duration-500 place-self-end p-1 cursor-pointer"
                                >
                                    <MdClear size="1.5rem" />
                                </button>
                            </div>
                            <div className="pt-2 p-4">
                                <div className="text-center">
                                    <span>{t("delete_todo")}</span>
                                </div>
                                <div className="flex flex-row justify-center mt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowAlert(false)}
                                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                        className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                text-black dark:text-white dark:hover:text-black transition duration-500 cursor-pointer p-2 mr-2 rounded"
                                    >
                                        {t("cancel")}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => dispatch({ type: 'delete_todo', listId, todoId })}
                                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                        className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                text-black dark:text-white dark:hover:text-black transition duration-500 cursor-pointer p-2 rounded"
                                    >
                                        {t("delete")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}