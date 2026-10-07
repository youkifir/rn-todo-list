import React from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";
import type { ThemeColors } from "@/types";

export default function StatsScreen() {
  const { colors } = useTheme();
  const styles = createStyles(colors);

  // Реактивная статистика напрямую из Convex (вместо useTodos)
  const stats = useQuery(api.todos.getStats);

  if (stats === undefined) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>📊 Статистика</Text>
        <Text style={styles.subtitle}>
          Аналитика задач в реальном времени
        </Text>

        <View style={styles.grid}>
          {/* Карта 1: Всего */}
          <View style={styles.card}>
            <Ionicons name="list" size={28} color={colors.primary} />
            <Text style={styles.cardValue}>{stats.total}</Text>
            <Text style={styles.cardLabel}>Всего задач</Text>
          </View>

          {/* Карта 2: Активные */}
          <View style={styles.card}>
            <Ionicons name="time" size={28} color="#F59E0B" />
            <Text style={styles.cardValue}>{stats.active}</Text>
            <Text style={styles.cardLabel}>В процессе</Text>
          </View>

          {/* Карта 3: Выполнено */}
          <View style={styles.card}>
            <Ionicons name="checkmark-done-circle" size={28} color={colors.success} />
            <Text style={styles.cardValue}>{stats.completed}</Text>
            <Text style={styles.cardLabel}>Выполнено</Text>
          </View>

          {/* Карта 4: Процент */}
          <View style={styles.card}>
            <Ionicons name="trending-up" size={28} color="#8B5CF6" />
            <Text style={styles.cardValue}>{stats.percentage}%</Text>
            <Text style={styles.cardLabel}>Прогресс</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.bg,
    },
    content: { padding: 20 },
    centerContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 14,
      marginTop: 4,
      marginBottom: 20,
      color: colors.textMuted,
    },
    grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
    card: {
      width: "48%",
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: "center",
      gap: 6,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    cardValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    cardLabel: {
      fontSize: 13,
      color: colors.textMuted,
    },
  });