"use client"
import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from "react";
import listReducer, { List, Todo, Action } from "../reducers/listReducer";

const initialLists: { id: number, name: string, color: string, todos: Todo[]; }[] = [];

const localStorageKey = "fun-todo-data";

const TodoContext = createContext<{
    lists: { id: number, name: string, color: string, todos: Todo[]; }[];
    dispatch: React.Dispatch<Action>;
} | null>(null);

export function TodoProvider({ children }: { children: ReactNode }) {

    const [lists, dispatch] = useReducer(listReducer, initialLists);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {

        const stored = localStorage.getItem(localStorageKey);

        if (stored) {
            const parsed: List[] = JSON.parse(stored);
            dispatch({ type: "hydrate_all", data: parsed });
        }

        setIsLoaded(true);

    }, []);

    useEffect(() => {
        // Accessing the localStorage only after mount
        if (isLoaded) {
            localStorage.setItem(localStorageKey, JSON.stringify(lists));
        }

    }, [lists, isLoaded]);

    return (
        <TodoContext value={{ lists, dispatch }}>
            {children}
        </TodoContext>
    );
}

export function useTodo() {
    const context = useContext(TodoContext);
    if (!context) throw new Error("useTodo must be used within a TodoProvider.");
    return context;
}