import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function TasksScreen() {
    const { colors } = useTheme();
    const { todos, loading, addTodo, toggleTodo, deleteTodo, editTodo } = useTodos();

    const completedCount = todos.filter((t) => t.completed).length;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <View style={[styles.container, { backgroundColor: colors.surface }]}>
                <Header totalCount={todos.length} completedCount={completedCount} />
                <TodoForm onAdd={addTodo} loading={loading} />

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={colors.primary} />
                    </View>
                ) : (
                    <TodoList
                        todos={todos}
                        onToggle={toggleTodo}
                        onDelete={deleteTodo}
                        onEdit={editTodo}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        margin: 16,
        padding: 16,
        borderRadius: 12,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});