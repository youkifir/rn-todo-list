import { StatusBarStyle } from "expo-status-bar";
import { Id } from "../../convex/_generated/dataModel";

export interface Todo {
  _id: Id<"todos">; // Convex використовує _id замість id
  text: string;
  isCompleted: boolean; // замість completed
  createdAt: number;
  _creationTime?: number;
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
  editTodo?: (id: string, newText: string) => Promise<void>;
  clearCompleted: () => Promise<void>;
  clearAll: () => Promise<void>;
}