import { StatusBarStyle } from "expo-status-bar";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

export type ThemeMode = "light" | "dark";

export interface ThemeColors {
  bg: string;
  surface: string;
  text: string;
  textMuted: string;
  border: string;
  primary: string;
  success: string;
  danger: string;
  cardBg: string;
  statusBarStyle: StatusBarStyle;
}

export interface ThemeContextType {
  theme: ThemeMode;
  colors: ThemeColors;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  addTodo: (text: string) => Promise<void>;
  toggleTodo: (id: string) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  editTodo: (id: string, text: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
}