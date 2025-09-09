"use client"
import { useState, useRef, useEffect } from "react";
import ToDo from "./todo";
import { MdClear, MdColorLens, MdEdit, MdSave } from "react-icons/md";
import { Todo } from "../reducers/listReducer";
import { useTranslation } from "react-i18next";

interface ToDoListProps {
    id: number;
    name: string;
    color: string;
    todos: Todo[];
    editingTodoListId: number | null;
    setEditingTodoListId: React.Dispatch<React.SetStateAction<number | null>>;
    dispatch: React.Dispatch<any>;
}

const defaultErrors = {
    edit_error_1: false,
    edit_error_2: false,
    add_error_1: false,
    add_error_2: false,
};

export default function ToDoList({ id, name, color, todos, editingTodoListId, setEditingTodoListId, dispatch }: ToDoListProps) {

    const { t } = useTranslation();
    const [todoText, setTodoText] = useState<string>("");
    const [newName, setNewName] = useState<string>(name);
    const [showError, setShowError] = useState(defaultErrors);
    const [listColor, setListColor] = useState<string>(color ? color : "ffe97a");

    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

    const isEditing = editingTodoListId === id;

    const [modalsVisible, setModalsVisible] = useState({
        newTodo: false,
        changeColor: false,
        deleteList: false,
    });

    const [shouldRender, setShouldRender] = useState({
        newTodo: false,
        changeColor: false,
        deleteList: false,
    });

    const newTodoRef = useRef<HTMLDivElement>(null);
    const changingColorRef = useRef<HTMLDivElement>(null);
    const deleteListRef = useRef<HTMLDivElement>(null);

    const availableColors = [
        "ffe97a",
        "f7a6c2",
        "33d7d4",
        "b5e28c",
        "ffa970",
        "d1b7e6",
    ];

    useEffect(() => {

        const modals = [
            { key: "newTodo", ref: newTodoRef },
            { key: "changeColor", ref: changingColorRef },
            { key: "deleteList", ref: deleteListRef },

        ];

        // If the click target is not inside the modal, close it		
        const handleClickOutside = (event: MouseEvent) => {
            modals.forEach(({ key, ref }) => {
                if (modalsVisible[key as keyof typeof modalsVisible] && ref.current && !ref.current.contains(event.target as Node)) {
                    setModalsVisible((prev) => ({ ...prev, [key]: false }));
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);

        modals.forEach(({ key }) => {
            const isVisible = modalsVisible[key as keyof typeof modalsVisible];

            // If the modal is visible, render it
            if (isVisible) {

                setShouldRender((prev) => ({ ...prev, [key]: true }));

            } else if (shouldRender[key as keyof typeof shouldRender]) {
                if (key === "newTodo") {
                    setTodoText("");
                    setShowError(defaultErrors);
                }
                // Delay unmount for the duration of the fade-out
                const timeout = setTimeout(() => {
                    setShouldRender((prev) => ({ ...prev, [key]: false }));
                }, 300); // Match Tailwind duration

                return () => clearTimeout(timeout);
            }
        });

        // Clean up function to remove the 'mousedown' event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };

    }, [modalsVisible]);

    const handleEditList = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (newName.trim().length < 1) {
            setShowError(((prev) => ({ ...prev, edit_error_1: true })));
            return;
        }

        if (newName.trim().length > 50) {
            setShowError(((prev) => ({ ...prev, edit_error_2: true })));
            return;
        }

        dispatch({
            type: 'edit_list',
            list: {
                id,
                name: newName,
            }
        })

        setEditingTodoListId(null);
    }

    const handleChangeListColor = (color: string) => {

        dispatch({
            type: 'change_color',
            list: {
                id,
                color: color,
            }
        })

        setListColor(color);

    }

    const handleAddTodo = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (todoText.trim().length < 1) {
            setShowError(((prev) => ({ ...prev, add_error_1: true })));
            return;
        }

        if (todoText.trim().length > 30) {
            setShowError(((prev) => ({ ...prev, add_error_2: true })));
            return;
        }

        dispatch({
            type: 'add_todo',
            listId: id,
            text: todoText,
        })

        setTodoText("");
        setModalsVisible(((prev) => ({ ...prev, newTodo: false })));
    }

    const handleCancelEdit = () => {
        setNewName(name);
        setEditingTodoListId(null);
        setShowError(defaultErrors);
    }

    const handleCancelAddTodo = () => {
        setTodoText("");
        setModalsVisible(((prev) => ({ ...prev, newTodo: false })));
        setShowError(defaultErrors);
    }

    return (
        <div>
            <div
                className={`bottom-0 -translate-y-[5px] transform transition-all duration-300
					        ${modalsVisible.changeColor ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none translate-y-[5px]'}`}
            >
                {shouldRender.changeColor ? (
                    <div ref={changingColorRef} className="flex flex-row w-full h-[50px] gap-2 p-2 mb-2 z-30">
                        {availableColors.map((c) => (
                            <button
                                key={c}
                                onClick={() => handleChangeListColor(c)}
                                className={`w-[40px] h-[40px] rounded-full border-2 ${listColor === c ? 'border-black scale-110' : 'border-transparent'
                                    }`}
                                style={{ backgroundColor: `#${c}` }}
                            >
                            </button>
                        ))}
                    </div>
                ) : (
                    <></>
                )}
            </div>
            <div className="flex flex-col min-h-[250px] w-[300px] border bg-white dark:bg-[#5a5a5a] shadow-lg rounded"
                style={{ boxShadow: `-7px 7px #${listColor}` }}
            >
                <div className="flex flex-row justify-end">
                    <button
                        type="button"
                        onClick={() => setModalsVisible((prev) => ({ ...prev, changeColor: true }))}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className={`hover:text-[var(--dynamic-color)] transition duration-500 place-self-end p-1 cursor-pointer ${modalsVisible.changeColor
                            ? "text-[var(--dynamic-color)] dark:text-[var(--dynamic-color)]"
                            : "text-black dark:text-white"
                            }`}
                    >
                        <MdColorLens size="1.5rem" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setModalsVisible(((prev) => ({ ...prev, deleteList: true })))}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 place-self-end p-1 cursor-pointer"
                    >
                        <MdClear size="1.5rem" />
                    </button>
                </div>
                {isEditing ? (
                    <div className="inline-flex justify-center p-2">
                        <form onSubmit={handleEditList}>
                            <input
                                type="text"
                                name="edited-name"
                                value={newName}
                                onChange={(e) => {
                                    setNewName(e.target.value);
                                    if (showError) setShowError(defaultErrors);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditList(e);
                                }}
                                className="border-2 border-black rounded mr-2 pl-1"
                            />
                            <button
                                type="submit"
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdSave />
                            </button>
                            <button
                                type="button"
                                onClick={() => handleCancelEdit()}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdClear />
                            </button>
                            {showError.edit_error_1 && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{t("alert_list_1")}</p>
                            )}
                            {showError.edit_error_2 && (
                                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{t("alert_list_2")}</p>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="inline-flex items-center justify-center p-2 flex-wrap">
                        <h1 className="mr-2 text-xl break-words max-w-[200px]"> {name} </h1>
                        <button
                            type="button"
                            onClick={() => setEditingTodoListId(id)}
                            style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                            className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                        >
                            <MdEdit />
                        </button>
                    </div>
                )}
                <div className="flex flex-col min-h-[175px] p-2">
                    <div className="flex flex-col justify-center items-center relative">
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center transform transition-all duration-300
                                        ${modalsVisible.newTodo ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none -translate-x-1/2 -translate-y-1/2'}`}
                        >
                            {shouldRender.newTodo && (
                                <div ref={newTodoRef}
                                    style={{ boxShadow: `7px 7px #${listColor}` }}
                                    className="border bg-white dark:bg-[#5a5a5a] shadow-lg rounded"
                                >
                                    <div className="flex flex-row justify-end">
                                        <button
                                            type="button"
                                            onClick={() => handleCancelAddTodo()}
                                            className="text-black dark:text-white hover:text-[#ffe97a] transition duration-500 place-self-end p-1 cursor-pointer"
                                        >
                                            <MdClear size="1.5rem" />
                                        </button>
                                    </div>
                                    <div className="pt-2 p-4">
                                        <form onSubmit={handleAddTodo} className="flex flex-col items-center w-full">
                                            <label className="flex flex-col items-center w-full mb-2">
                                                <span className="text-md mb-2 text-center">
                                                    {t("new_todo")}
                                                </span>
                                                <input
                                                    type="text"
                                                    name="new-todo"
                                                    placeholder={t("new_todo_placeholder")}
                                                    value={todoText}
                                                    onChange={(e) => {
                                                        setTodoText(e.target.value);
                                                        if (showError) setShowError(defaultErrors);
                                                    }}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleAddTodo(e);
                                                    }}
                                                    className="border rounded flex justify-center text-center mb-2 pl-1"
                                                />
                                            </label>
                                            <div className="flex justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleCancelAddTodo()}
                                                    style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                    className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                            text-black dark:text-white dark:hover:text-black transition duration-500 cursor-pointer p-2 rounded mr-2"
                                                >
                                                    {t("cancel")}
                                                </button>
                                                <button
                                                    type="submit"
                                                    style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                    className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                            text-black dark:text-white dark:hover:text-black transition duration-500 cursor-pointer p-2 rounded"
                                                >
                                                    {t("add_todo")}
                                                </button>
                                            </div>
                                            {showError.add_error_1 && (
                                                <p className="text-red-500 text-sm mt-1">{t("alert_todo_1")}</p>
                                            )}
                                            {showError.add_error_2 && (
                                                <p className="text-red-500 text-sm mt-1">{t("alert_todo_2")}</p>
                                            )}
                                        </form>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col justify-center items-center transform transition-all duration-300
                                        ${modalsVisible.deleteList ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none -translate-x-1/2 -translate-y-1/2'}`}
                        >
                            {shouldRender.deleteList && (
                                <div
                                    ref={deleteListRef}
                                    style={{ boxShadow: `7px 7px #${listColor}` }}
                                    className="border bg-white dark:bg-[#5a5a5a] shadow-lg rounded"
                                >
                                    <div className="flex flex-row justify-end">
                                        <button
                                            type="button"
                                            onClick={() => setModalsVisible(((prev) => ({ ...prev, deleteList: false })))}
                                            className="text-black dark:text-white hover:text-[#ffe97a] transition duration-500 place-self-end p-1 cursor-pointer"
                                        >
                                            <MdClear size="1.5rem" />
                                        </button>
                                    </div>
                                    <div className="pt-2 p-4">
                                        <div className="text-center">
                                            <span>{t("delete_list")}</span>
                                        </div>
                                        <div className="flex flex-row justify-center mt-2">
                                            <button
                                                type="button"
                                                onClick={() => setModalsVisible(((prev) => ({ ...prev, deleteList: false })))}
                                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                className="cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                        text-black dark:text-white dark:hover:text-black transition duration-500 p-2 mr-2 rounded"
                                            >
                                                {t("cancel")}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => dispatch({ type: 'delete_list', id })}
                                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                className="cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                                        text-black dark:text-white dark:hover:text-black transition duration-500 p-2 rounded"
                                            >
                                                {t("delete")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    {[...todos].reverse().map(t => <ToDo key={t.todoId} todoId={t.todoId} text={t.text} done={t.done} listColor={listColor} listId={id} editingTodoId={editingTodoId} setEditingTodoId={setEditingTodoId} dispatch={dispatch} />)}
                </div>
                <div className="place-self-end p-2">
                    <button
                        type="button"
                        onClick={() => setModalsVisible(((prev) => ({ ...prev, newTodo: true })))}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className="text-center cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] 
                                text-black dark:text-white dark:hover:text-black transition duration-500 p-2 rounded"
                    >
                        {t("add_todo")}
                    </button>
                </div>
            </div>
        </div>
    );
}