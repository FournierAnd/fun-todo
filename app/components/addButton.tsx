import { Dispatch, SetStateAction } from "react";
import { IoAddCircle } from "react-icons/io5";

interface ToDoListProps {
  setIsVisible: Dispatch<SetStateAction<Boolean>>;
}

export default function AddButtonDiv({ setIsVisible } : ToDoListProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[250px] min-w-[250px]">
            <button onClick={() => setIsVisible(true)} className="cursor-pointer">
                <IoAddCircle size="4rem" />
            </button>
        </div>
    );
}