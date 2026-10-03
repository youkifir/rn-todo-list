import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeColors, ThemeContextType, ThemeMode } from "@/types";

const THEME_STORAGE_KEY = "@todo_theme_mode";

const lightColors: ThemeColors = {
    bg: "#f3f4f6",
    surface: "#ffffff",
    text: "#1f2937",
    textMuted: "#6b7280",
    border: "#e5e7eb",
    primary: "#6366f1",
    success: "#10b981",
    danger: "#ef4444",
    cardBg: "#ffffff",
    statusBarStyle: "dark",
};

const darkColors: ThemeColors = {
    bg: "#111827",
    surface: "#1f2937",
    text: "#f9fafb",
    textMuted: "#9ca3af",
    border: "#374151",
    primary: "#818cf8",
    success: "#34d399",
    danger: "#f87171",
    cardBg: "#1f2937",
    statusBarStyle: "light",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeMode>("light");

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (savedTheme === "light" || savedTheme === "dark") {
                setTheme(savedTheme);
            }
        } catch (e) {
            console.error("Помилка завантаження теми:", e);
        }
    };

    const toggleTheme = async () => {
        try {
            const nextTheme = theme === "light" ? "dark" : "light";
            setTheme(nextTheme);
            await AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        } catch (e) {
            console.error("Помилка збереження теми:", e);
        }
    };

    const isDarkMode = theme === "dark";
    const colors = isDarkMode ? darkColors : lightColors;

    return (
        <ThemeContext.Provider value={{ theme, colors, toggleTheme, isDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme повинен використовуватися усередині ThemeProvider");
    }
    return context;
};