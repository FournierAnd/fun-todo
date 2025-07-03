"use client"
import { useRef, useState } from "react";
import { MdEdit, MdDelete, MdSave, MdClear } from "react-icons/md";
import { motion, AnimatePresence } from "motion/react";

interface ToDoProps {
    todoId: number;
    text: string;
    done: boolean;
    listColor: string;
    listId: number;
    dispatch: React.Dispatch<any>;
}

export default function ToDo({ todoId, text, done, listColor, listId, dispatch }: ToDoProps) {

    const [isEditing, setIsEditing] = useState(false);
    const [todoEditError, setTodoEditError] = useState("");
    const [newText, setNewText] = useState(text);
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    const deleteTodoRef = useRef<HTMLDivElement>(null);

    const handleEdit = () => {

        if (newText.trim().length < 1) {
            setTodoEditError("A todo cannot be empty.");
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
        setIsEditing(false);
    }

    return (
        <>
            <div className="inline-flex justify-between relative">
                <div className="inline-flex">
                    <input style={{ accentColor: `#${listColor}`}} type="checkbox" onChange={() => dispatch({ type: 'toggle_todo', listId, todoId })} checked={done} />
                    {isEditing ? (
                        <input
                            type="text"
                            name="edit-field"
                            value={newText}
                            onChange={(e) => {
                                setNewText(e.target.value);
                                if (todoEditError) setTodoEditError("");
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleEdit();
                            }}
                            className="border-2 border-black rounded ml-2 pl-1"
                        />
                    ) : (
                        <div className="relative ml-1 w-fit">
                            <span className={`${done ? "text-gray-500" : "text-black"} break-words max-w-[225px] text-lg pl-1 z-10 relative`}> {text} </span>
                            {done && (
                                <svg
                                    viewBox="0 0 70 20"
                                    className="absolute top-1/2 left-0 w-full h-[20px] -translate-y-1/2 z-10"
                                    preserveAspectRatio="none"
                                >
                                    <path
                                        d="m0 12c4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-8 8 0 4 0 8-6 8 0"
                                        stroke={`#${listColor}`}
                                        strokeWidth="2"
                                        fill="none"
                                        strokeLinecap="round"
                                        strokeDasharray="100"
                                        strokeDashoffset="100"
                                    >
                                        <animate
                                            attributeName="stroke-dashoffset"
                                            from="100"
                                            to="0"
                                            dur="0.6s"
                                            fill="freeze"
                                        />
                                    </path>
                                </svg>
                            )}
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
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdSave />
                            </button>
                            <button
                                type="button"
                                onClick={() => { setNewText(text); setIsEditing(false); }}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdClear />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdEdit />
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowAlert(true)}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
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
                        {todoEditError && (
                            <p className="text-red-500 text-sm ml-5 mt-1">{todoEditError}</p>
                        )}
                    </div>
                </>
            ) : (
                <></>
            )}
            <div className="flex flex-col justify-center items-center">
                {showAlert && (
                    <div ref={deleteTodoRef}
                        style={{ boxShadow: `7px 7px #${listColor}` }}
                        className="absolute z-30 flex flex-col items-center border p-4 bg-white shadow-lg rounded"
                    >
                        <span className="mb-2 mr-2">Delete this todo?</span>
                        <div>
                            <button
                                type="button"
                                onClick={() => setShowAlert(false)}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 cursor-pointer p-2 rounded mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch({ type: 'delete_todo', listId, todoId })}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 cursor-pointer p-2 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}