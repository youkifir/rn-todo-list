import React from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/types";

import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";

export default function TodosScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  const todos = useQuery(api.todos.getTodos);

  const addTodo = useMutation(api.todos.createTodo);
  const toggleTodo = useMutation(api.todos.toggleTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);
  const updateTodo = useMutation(api.todos.updateTodo);

  const handleToggle = async (id: Id<"todos">) => {
    await toggleTodo({ id });
  };

  const handleDelete = async (id: Id<"todos">) => {
    await deleteTodo({ id });
  };

  const handleEdit = async (id: Id<"todos">, newText: string) => {
    await updateTodo({ id, text: newText });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Header
        totalCount={todos?.length ?? 0}
        completedCount={todos?.filter((t) => t.isCompleted).length ?? 0}
      />

      <TodoForm
        onAdd={async (text) => {
          await addTodo({ text });
        }}
      />

      {todos === undefined ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Синхронизация с Convex...</Text>
        </View>
      ) : (
        <TodoList
          todos={todos}
          onToggle={handleToggle}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: colors.textMuted,
    },
  });