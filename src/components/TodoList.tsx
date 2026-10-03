import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    onToggle: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
    const { colors } = useTheme();

    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Список завдань порожній. Додайте нове завдання!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TodoItem
                    todo={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingBottom: 16,
    },
    emptyContainer: {
        padding: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    emptyText: {
        fontSize: 16,
        textAlign: "center",
    },
});