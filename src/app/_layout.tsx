import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TodoProvider } from "@/context/TodoContext";

function RootContent() {
    const { colors, isDarkMode } = useTheme();

    return (
        <>
            <StatusBar style={isDarkMode ? "light" : "dark"} />
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors.bg },
                }}
            />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <TodoProvider>
                    <RootContent />
                </TodoProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}