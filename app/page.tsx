"use client"
import { useEffect, useReducer, useRef, useState } from "react";
import ToDoList from "./components/todoList";
import AddButtonDiv from "./components/addButton";
import { useTodo } from "./contexts/todoContext";

export default function Home() {

  const { lists, dispatch } = useTodo();
  const [listName, setListName] = useState<string>("");
  const [listNameError, setListNameError] = useState<string>("");
  const [isVisible, setIsVisible] = useState<Boolean>(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {

    // If the click target is not inside the modal, close it
    const handleModalClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
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

  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();

    if (listName.trim().length < 1) {
      setListNameError("List name cannot be empty.");
      return;
    }

    const lastList = lists[lists.length - 1];
    const lastId = typeof lastList?.id === "number" ? lastList.id : 0;

    dispatch({
      type: 'add_list',
      id: lastId + 1,
      name: listName,
    })

    setListName("");
    setIsVisible(false);
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      <AddButtonDiv setIsVisible={setIsVisible} />
      {isVisible && (
        <div 
          ref={modalRef}
          style={{ boxShadow: `7px 7px #ffe97a` }}
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center border p-4 bg-white shadow-lg rounded"
        >
          <form onSubmit={handleSubmit}>
            <label>
              Name your new todo list: 
              <input
                type="text"
                name="list-name"
                value={listName}
                onChange={(e) => {
                  setListName(e.target.value);
                  if (listNameError) setListNameError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSubmit(e);
                }}
                placeholder="My Fun Todo list!"
                className="border rounded mx-2 pl-1"
              />
            </label>
            <button type="button" onClick={() => setIsVisible(false)} className="cursor-pointer border ring-2 ring-[#ffe97a] hover:bg-[#ffe97a] transition duration-500 p-2 rounded mr-2">Cancel</button>
            <button type="submit" className="cursor-pointer border ring-2 ring-[#ffe97a] hover:bg-[#ffe97a] transition duration-500 p-2 rounded">Add</button>
            
            {listNameError && (
              <p className="text-red-500 text-sm mt-1">{listNameError}</p>
            )}
          </form>
        </div>
      )}
      {[...lists].reverse().map(l => <ToDoList key={l.id} id={l.id} name={l.name} color={l.color} todos={l.todos} dispatch={dispatch} />)}
    </div>
  );
}