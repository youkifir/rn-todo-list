import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Doc<"todos">[];
  onToggle: (id: Id<"todos">) => Promise<void>;
  onDelete: (id: Id<"todos">) => Promise<void>;
  onEdit?: (id: Id<"todos">, text: string) => Promise<void>;
}

export function TodoList({ todos, onToggle, onDelete, onEdit }: TodoListProps) {
  const { colors } = useTheme();

  if (todos.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.textMuted }]}>
          Список задач пуст. Добавьте новую задачу!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={todos}
      keyExtractor={(item) => item._id}
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