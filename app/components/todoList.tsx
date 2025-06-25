import { useState, useRef, useEffect } from "react";
import ToDo from "./todo";
import { MdClear, MdEdit, MdSave } from "react-icons/md";
import { Todo } from "../reducers/listReducer";

interface ToDoListProps {
    id: number;
    name: string;
    todos: Todo[];
    dispatch: React.Dispatch<any>;
}

export default function ToDoList({ id, name, todos, dispatch }: ToDoListProps) {

    const [todoText, setTodoText] = useState("");
    const [newName, setNewName] = useState(name);
    const [isVisible, setIsVisible] = useState<Boolean>(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editError, setEditError] = useState("");
    const [addTodoError, setAddTodoError] = useState("");
    const [showAlert, setShowAlert] = useState<Boolean>(false);
    const newTodoRef = useRef<HTMLDivElement>(null);
    const deleteListRef = useRef<HTMLDivElement>(null);

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
        <div className="flex flex-col min-h-[250px] min-w-[250px] border bg-white shadow-md rounded">
            <button type="button" onClick={() => setShowAlert(true)} className="place-self-end p-1 cursor-pointer">
                <MdClear size="1.5rem" />
            </button>
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
                            className="border-2 border-black rounded mr-2"
                        />
                        <button type="submit" className="cursor-pointer"><MdSave /></button>
                        <button type="button" onClick={() => {setNewName(name); setIsEditing(false);}} className="cursor-pointer"><MdClear /></button>

                        {editError && (
                            <p className="text-red-500 text-sm mt-1">{editError}</p>
                        )}
                    </form>
                </div>
            ) : (
                <div className="inline-flex justify-center p-2">
                    <h1 className="mr-2"> {name} </h1>
                    <button type="button" onClick={() => setIsEditing(true)} className="cursor-pointer"><MdEdit /></button>
                </div>
            )}
            <div className="flex flex-col min-h-[175px] p-2">
                <div className="flex flex-col justify-center items-center relative">
                    {isVisible && (
                        <div ref={newTodoRef} className="absolute z-10 flex items-center border p-4 bg-white shadow-lg rounded">
                            <form onSubmit={handleAddTodo}>
                                <input
                                    type="text"
                                    name="new-todo"
                                    placeholder="Name your new todo"
                                    value={todoText}
                                    onChange={(e) => {
                                        setTodoText(e.target.value);
                                        if (addTodoError) setAddTodoError("");
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleAddTodo(e);
                                    }}
                                    className="border rounded mr-2 pl-1"
                                />
                                <button type="button" onClick={() => setIsVisible(false)} className="cursor-pointer border p-2 rounded mr-2">Cancel</button>
                                <button type="submit" className="cursor-pointer border p-2 rounded">Add</button>
                                {addTodoError && (
                                    <p className="text-red-500 text-sm mt-1">{addTodoError}</p>
                                )}
                            </form>
                        </div>
                    )}
                    {showAlert && (
                        <div ref={deleteListRef} className="absolute z-10 flex items-center border p-4 bg-white shadow-lg rounded">
                            <span className="mr-2">Are you sure you want to delete your todo list?</span>
                            <button type="button" onClick={() => setShowAlert(false)} className="cursor-pointer border p-2 rounded mr-2">Cancel</button>
                            <button type="button" onClick={() => dispatch({ type: 'delete_list', id })} className="cursor-pointer border p-2 rounded">Delete</button>
                        </div>
                    )}
                </div>
                {[...todos].reverse().map(t => <ToDo key={t.todoId} todoId={t.todoId} text={t.text} listId={id} dispatch={dispatch} />)}
            </div>
            <div className="place-self-end p-2">
                <button type="button" onClick={() => setIsVisible(true)} className="text-center cursor-pointer border p-2 rounded">
                    Add Todo
                </button>
            </div>
        </div>
    );
}