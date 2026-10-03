import type { Todo } from "@/types";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    refreshing: boolean;
    onRefresh: () => Promise<void>;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
    todos,
    refreshing,
    onRefresh,
    onToggle,
    onDelete,
    onEdit,
}: TodoListProps) {
    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                    Список задач пуст. Добавьте новую задачу!
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
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={["#6366f1"]}
                />
            }
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
        color: "#6b7280",
        textAlign: "center",
    },
});