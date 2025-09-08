"use client"
import { useEffect, useRef, useState } from "react";
import ToDoList from "./components/todoList";
import AddButtonDiv from "./components/addButton";
import { useTodo } from "./contexts/todoContext";
import { useTranslation } from "react-i18next";
import { MdClear } from "react-icons/md";

const defaultErrors = {
  error_1: false,
  error_2: false,
};

export default function Home() {

    const { t } = useTranslation();
    const { lists, dispatch } = useTodo();
    const [listName, setListName] = useState<string>("");
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [shouldRender, setShouldRender] = useState(isVisible);
    const modalRef = useRef<HTMLDivElement>(null);

    const [showListNameError, setShowListNameError] = useState(defaultErrors);

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
            setShouldRender(true);
        } else {
            handleCancel();
            // Delay unmount for the duration of the fade-out
            const timeout = setTimeout(() => setShouldRender(false), 300); // Match Tailwind duration
            return () => clearTimeout(timeout);
        }

        // Clean up function to remove the 'mousedown' event listener
        return () => {
            document.removeEventListener('mousedown', handleModalClickOutside);
        };

    }, [isVisible]);

    const handleSubmit = (event: { preventDefault: () => void; }) => {
        event.preventDefault();

        if (listName.trim().length < 1) {
            setShowListNameError(((prev) => ({ ...prev, error_1: true })));
            return;
        }

        if (listName.trim().length > 50) {
            setShowListNameError(((prev) => ({ ...prev, error_2: true })));
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

    const handleCancel = () => {
        setListName("");
        setIsVisible(false);
        setShowListNameError(defaultErrors);
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 place-items-center">
            <AddButtonDiv setIsVisible={setIsVisible} />
            <div className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col md:flex-row items-center transform transition-all duration-300
                            ${isVisible ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none -translate-x-1/2 -translate-y-1/2'}`}
            >
                {shouldRender && (
                    <div
                        ref={modalRef}
                        style={{ boxShadow: `7px 7px #ffe97a` }}
                        className="border bg-white dark:bg-[#5a5a5a] shadow-lg rounded"
                    >
                        <div className="flex flex-row justify-end">
                            <button
                                type="button"
                                onClick={() => handleCancel()}
                                className="text-black dark:text-white hover:text-[#ffe97a] transition duration-500 place-self-end p-1 cursor-pointer"
                            >
                                <MdClear size="1.5rem" />
                            </button>
                        </div>
                        <div className="pt-2 p-4">
                            <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
                                <label className="flex flex-col md:flex-row md:items-center w-full mb-2">
                                    <span className="text-md mb-2 md:mb-1 md:mr-2 text-center md:text-left">
                                        {t("add_list")}
                                    </span>
                                    <input
                                        type="text"
                                        name="list-name"
                                        value={listName}
                                        onChange={(e) => {
                                            setListName(e.target.value);
                                            if (showListNameError) setShowListNameError(defaultErrors);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleSubmit(e);
                                        }}
                                        placeholder={t("add_list_placeholder")}
                                        className="border rounded flex justify-center md:justify-start text-center md:text-left mx-0 md:mx-2 mb-2 pl-1"
                                    />
                                </label>                                
                                {showListNameError.error_1 && (
                                    <div className="flex justify-center items-center text-center pb-3">
                                        <p className="text-red-500 dark:text-red-400 text-sm">{t("alert_list_1")}</p>
                                    </div>
                                )}
                                {showListNameError.error_2 && (
                                    <div className="flex justify-center items-center text-center pb-3">
                                        <p className="text-red-500 dark:text-red-400 text-sm">{t("alert_list_2")}</p>
                                    </div>
                                )}
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => handleCancel()}
                                        className="cursor-pointer border ring-2 ring-[#ffe97a] hover:bg-[#ffe97a] text-black dark:text-white dark:hover:text-black 
                                                transition duration-500 p-2 rounded mr-2"
                                    >
                                        {t("cancel")}
                                    </button>
                                    <button
                                        type="submit"
                                        className="cursor-pointer border ring-2 ring-[#ffe97a] hover:bg-[#ffe97a] text-black dark:text-white dark:hover:text-black
                                                transition duration-500 p-2 rounded"
                                    >
                                        {t("add")}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
            {[...lists].reverse().map(l => <ToDoList key={l.id} id={l.id} name={l.name} color={l.color} todos={l.todos} dispatch={dispatch} />)}
        </div>
    );
}