import { useState, useRef, useEffect } from "react";
import ToDo from "./todo";
import { MdClear, MdColorLens, MdEdit, MdSave } from "react-icons/md";
import { Todo } from "../reducers/listReducer";
import { useTodo } from "../contexts/todoContext";

interface ToDoListProps {
    id: number;
    name: string;
    color: string;
    todos: Todo[];
    dispatch: React.Dispatch<any>;
}

export default function ToDoList({ id, name, color, todos, dispatch }: ToDoListProps) {

    const [todoText, setTodoText] = useState("");
    const [newName, setNewName] = useState(name);
    const [isVisible, setIsVisible] = useState<Boolean>(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState("");
    const [addTodoError, setAddTodoError] = useState("");
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    const newTodoRef = useRef<HTMLDivElement>(null);

    const [listColor, setListColor] = useState<string>(color ? color : "ffe97a");
    const [isChangingColor, setIsChangingColor] = useState(false);

    const availableColors = [
        "ffe97a",
        "f7a6c2",
        "33d7d4",
        "b5e28c",
        "ffa970",
        "d1b7e6",
    ];

    useEffect(() => {

        // If the click target is not inside the modal, close it
        const handleModalClickOutside = (event: MouseEvent) => {
            if (newTodoRef.current && !newTodoRef.current.contains(event.target as Node)) {
                setIsVisible(false);
            }
        };

        // If the modal is visible, add a 'mousedown' event listener
        if (isVisible) {
            document.addEventListener('mousedown', handleModalClickOutside);
        }

        // Clean up function to remove the 'mousedown' event listener
        return () => {
            document.removeEventListener('mousedown', handleModalClickOutside);
        };

    }, [isVisible]);

    const handleEditList = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (newName.trim().length < 1) {
            setEditError("List name cannot be empty.");
            return;
        }

        dispatch({
            type: 'edit_list',
            list: {
                id,
                name: newName,
            }
        })

        setIsEditing(false);
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
            setAddTodoError("A todo cannot be empty.");
            return;
        }

        dispatch({
            type: 'add_todo',
            listId: id,
            text: todoText,
        })

        setTodoText('');
        setIsVisible(false);
    }

    return (
        <div>
            {isChangingColor ? (
                <div className="flex flex-row w-[300px] h-[50px] gap-2 p-2 mb-2">
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
            <div className="flex flex-col min-h-[250px] min-w-[250px] border bg-white shadow-lg rounded"
                style={{ boxShadow: `-7px 7px #${listColor}` }}
            >
                <div className="flex flex-row justify-end">
                    <button
                        type="button"
                        onClick={() => setIsChangingColor((prev) => !prev)}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className="text-black hover:text-[var(--dynamic-color)] transition duration-500 place-self-end p-1 cursor-pointer"
                    >
                        <MdColorLens size="1.5rem" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setShowAlert(true)}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className="text-black hover:text-[var(--dynamic-color)] transition duration-500 place-self-end p-1 cursor-pointer"
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
                                    if (editError) setEditError("");
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleEditList(e);
                                }}
                                className="border-2 border-black rounded mr-2 pl-1"
                            />
                            <button
                                type="submit"
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdSave />
                            </button>
                            <button
                                type="button"
                                onClick={() => { setNewName(name); setIsEditing(false); }}
                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                            >
                                <MdClear />
                            </button>

                            {editError && (
                                <p className="text-red-500 text-sm mt-1">{editError}</p>
                            )}
                        </form>
                    </div>
                ) : (
                    <div className="inline-flex justify-center p-2">
                        <h1 className="mr-2 text-xl"> {name} </h1>
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                            className="text-black hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
                        >
                            <MdEdit />
                        </button>
                    </div>
                )}
                <div className="flex flex-col min-h-[175px] p-2">
                    <div className="flex flex-col justify-center items-center relative">
                        {isVisible && (
                            <div ref={newTodoRef}
                                style={{ boxShadow: `7px 7px #${listColor}` }}
                                className="absolute z-20 flex flex-col items-center border p-4 bg-white shadow-lg rounded"
                            >
                                <form onSubmit={handleAddTodo} className="flex flex-col items-center w-full">
                                    <label className="flex flex-col items-center w-full mb-2">
                                        <span className="text-md mb-2 text-center">
                                            Name your new todo:
                                        </span>
                                        <input
                                            type="text"
                                            name="new-todo"
                                            placeholder="My new todo..."
                                            value={todoText}
                                            onChange={(e) => {
                                                setTodoText(e.target.value);
                                                if (addTodoError) setAddTodoError("");
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
                                                onClick={() => setIsVisible(false)}
                                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 cursor-pointer p-2 rounded mr-2"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                                className="border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 cursor-pointer p-2 rounded"
                                            >
                                                Add
                                            </button>
                                        </div>
                                        {addTodoError && (
                                            <p className="text-red-500 text-sm mt-1">{addTodoError}</p>
                                        )}
                                </form>
                            </div>
                        )}
                        {showAlert && (
                            <div
                                style={{ boxShadow: `7px 7px #${listColor}` }}
                                className="absolute z-20 flex flex-col items-center border p-4 bg-white shadow-lg rounded"
                            >
                                <span className="text-md mb-2 text-center">Are you sure you want to delete your todo list?</span>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setShowAlert(false)}
                                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                        className="cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 p-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => dispatch({ type: 'delete_list', id })}
                                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                                        className="cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 p-2 rounded"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                    {[...todos].reverse().map(t => <ToDo key={t.todoId} todoId={t.todoId} text={t.text} listColor={listColor} listId={id} dispatch={dispatch} />)}
                </div>
                <div className="place-self-end p-2">
                    <button
                        type="button"
                        onClick={() => setIsVisible(true)}
                        style={{ ["--dynamic-color"]: `#${listColor}` } as React.CSSProperties}
                        className="text-center cursor-pointer border ring-2 ring-[var(--dynamic-color)] hover:bg-[var(--dynamic-color)] transition duration-500 p-2 rounded"
                    >
                        Add Todo
                    </button>
                </div>
            </div>
        </div>
    );
}