
export type Todo = {
    todoId: number;
    text: string;
    done: boolean;
}

export type List = {
    id: number;
    name: string;
    color: string;
    todos: Todo[];
}

export type Action =
    | { type: 'hydrate_all'; data: List[] }
    | { type: 'add_list'; id: number; name: string }
    | { type: 'edit_list'; list: { id: number; name: string } }
    | { type: 'delete_list'; id: number }
    | { type: 'change_color'; list: { id: number; color: string } }
    | { type: 'add_todo'; listId: number; text: string }
    | { type: 'edit_todo'; listId: number; todo: Todo }
    | { type: 'toggle_todo'; listId: number; todoId: number }
    | { type: 'delete_todo'; listId: number; todoId: number };

export default function listReducer(lists: List[], action: Action): List[] {
    switch (action.type) {
        case 'hydrate_all': {
            return action.data;
        }
        case 'add_list': {
            return [...lists, {
                id: action.id,
                name: action.name,
                color: "ffe97a",
                todos: [],
            }];
        }
        case 'edit_list': {
            return lists.map((list) =>
                list.id === action.list.id
                    ? { ...list, name: action.list.name }
                    : list
            );
        }
        case 'delete_list': {
            return lists.filter((list) => list.id !== action.id);
        }
        case 'change_color': {
            return lists.map((list) =>
                list.id === action.list.id
                    ? { ...list, color: action.list.color }
                    : list
            );
        }
        case 'add_todo': {
            return lists.map((list) =>
                list.id === action.listId
                    ? {
                        ...list,
                        todos: [
                            ...list.todos,
                            {
                                todoId: Date.now(),
                                text: action.text,
                                done: false
                            }
                        ]
                    }
                    : list
            );
        }
        case 'edit_todo': {
            return lists.map((list) =>
                list.id === action.listId
                    ? {
                        ...list,
                        todos: list.todos.map((todo) =>
                            todo.todoId === action.todo.todoId ? action.todo : todo
                        ),
                    }
                    : list
            );
        }
        case 'toggle_todo': {
            return lists.map((list) =>
                list.id === action.listId
                    ? {
                        ...list,
                        todos: list.todos.map(todo =>
                            todo.todoId === action.todoId
                                ? { ...todo, done: !todo.done }
                                : todo
                        ),
                    }
                    : list
            );
        }
        case 'delete_todo': {
            return lists.map((list) =>
                list.id === action.listId
                    ? {
                        ...list,
                        todos: list.todos.filter((todo) => todo.todoId !== action.todoId),
                    }
                    : list
            );
        }
        default: {
            throw Error('Unknown action');
        }
    }
}
