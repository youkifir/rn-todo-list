import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Todo, TodoContextType } from "@/types";

const TODOS_STORAGE_KEY = "@todo_items_v2";

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      const storedData = await AsyncStorage.getItem(TODOS_STORAGE_KEY);
      if (storedData) {
        setTodos(JSON.parse(storedData));
      }
    } catch (e) {
      console.error("Ошибка при чтении задач:", e);
    } finally {
      setLoading(false);
    }
  };

  const saveTodos = async (newTodos: Todo[]) => {
    try {
      setTodos(newTodos);
      await AsyncStorage.setItem(TODOS_STORAGE_KEY, JSON.stringify(newTodos));
    } catch (e) {
      console.error("Ошибка при сохранении задач:", e);
    }
  };

  const addTodo = async (text: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      completed: false,
      createdAt: Date.now(),
    };
    await saveTodos([newTodo, ...todos]);
  };

  const toggleTodo = async (id: string) => {
    const updated = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    await saveTodos(updated);
  };

  const deleteTodo = async (id: string) => {
    const updated = todos.filter((item) => item.id !== id);
    await saveTodos(updated);
  };

  const editTodo = async (id: string, text: string) => {
    const updated = todos.map((item) =>
      item.id === id ? { ...item, text } : item
    );
    await saveTodos(updated);
  };

  const clearCompleted = async () => {
    const updated = todos.filter((item) => !item.completed);
    await saveTodos(updated);
  };

  const clearAll = async () => {
    await saveTodos([]);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        addTodo,
        toggleTodo,
        deleteTodo,
        editTodo,
        clearCompleted,
        clearAll,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodos должен использоваться внутри TodoProvider");
  }
  return context;
};