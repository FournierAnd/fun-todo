"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { IoAddCircle } from "react-icons/io5";

interface ToDoListProps {
    setIsVisible: Dispatch<SetStateAction<Boolean>>;
}

export default function AddButtonDiv({ setIsVisible }: ToDoListProps) {

    const [hoverColor, setHoverColor] = useState<string>("ffe97a");
    const [isClient, setIsClient] = useState(false);

    const availableColors = [
        "ffe97a",
        "f7a6c2",
        "33d7d4",
        "b5e28c",
        "ffa970",
        "d1b7e6",
    ];

    useEffect(() => {
        setIsClient(true);
        setHoverColor(getRandomColor());
    }, []);

    const getRandomColor = () => {
        const randomNumber = Math.floor(Math.random() * availableColors.length);
        return availableColors[randomNumber];
    }

    const handleHover = () => {
        setHoverColor(getRandomColor());
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[250px] min-w-[250px]">
            <button
                onClick={() => setIsVisible(true)}
                onMouseEnter={handleHover}
                style={
                    isClient
                        ? ({ ["--dynamic-color"]: `#${hoverColor}` } as React.CSSProperties)
                        : undefined
                }
                className="text-black dark:text-white hover:text-[var(--dynamic-color)] transition duration-500 cursor-pointer"
            >
                <IoAddCircle size="4rem" />
            </button>
        </div>
    );
}