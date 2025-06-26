import { useRef, useState } from "react";
import { MdEdit, MdDelete, MdSave, MdClear } from "react-icons/md";

interface ToDoProps {
    todoId: number;
    text: string;
    listId: number;
    dispatch: React.Dispatch<any>;
}

export default function ToDo({ todoId, text, listId, dispatch }: ToDoProps) {

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
                    <input type="checkbox" />
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
                            className="border-2 border-black rounded ml-2 pl-2"
                        />
                    ) : (
                        <span className="break-words max-w-[225px] text-lg pl-2"> {text} </span>
                    )}
                </div>
                <div className="inline-flex flex-nowrap">
                    {isEditing ? (
                        <>
                            <button type="button" onClick={handleEdit} className="cursor-pointer"><MdSave /></button>
                            <button type="button" onClick={() => {setNewText(text); setIsEditing(false);}} className="cursor-pointer"><MdClear /></button>
                        </>
                    ) : (
                        <>
                            <button type="button" onClick={() => setIsEditing(true)} className="cursor-pointer"><MdEdit /></button>
                            <button type="button" onClick={() => setShowAlert(true)} className="cursor-pointer"><MdDelete /></button>
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
                    <div ref={deleteTodoRef} className="absolute z-10 flex items-center border p-4 bg-white shadow-lg rounded">
                        <span className="mr-2">Delete this todo?</span>
                        <button type="button" onClick={() => setShowAlert(false)} className="cursor-pointer border p-2 rounded mr-2">Cancel</button>
                        <button type="button" onClick={() => dispatch({ type: 'delete_todo', listId, todoId })} className="cursor-pointer border p-2 rounded">Delete</button>
                    </div>
                )}
            </div>
        </>
    );
}