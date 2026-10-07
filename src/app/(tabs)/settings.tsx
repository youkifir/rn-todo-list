import React, { useState } from "react";
import { StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const todos = useQuery(api.todos.getTodos);
    const clearCompleted = useMutation(api.todos.clearCompleted);
    const clearAll = useMutation(api.todos.clearAll);

    // Состояния подмена кнопок для inline-подтверждения
    const [confirmState, setConfirmState] = useState<"none" | "completed" | "all">("none");

    const isLoading = todos === undefined;
    const completedCount = todos?.filter((t) => t.isCompleted).length ?? 0;
    const totalCount = todos?.length ?? 0;

    const hasCompleted = completedCount > 0;
    const hasTodos = totalCount > 0;

    const handleExecuteCompleted = async () => {
        try {
            await clearCompleted();
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmState("none");
        }
    };

    const handleExecuteAll = async () => {
        try {
            await clearAll();
        } catch (err) {
            console.error(err);
        } finally {
            setConfirmState("none");
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Настройки</Text>

                {/* Переключатель темы */}
                <View
                    style={[
                        styles.section,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <View style={styles.row}>
                        <View style={styles.rowLabel}>
                            <Ionicons
                                name={isDarkMode ? "moon" : "sunny"}
                                size={22}
                                color={colors.primary}
                            />
                            <Text style={[styles.rowText, { color: colors.text }]}>
                                {isDarkMode ? "Тёмная тема" : "Светлая тема"}
                            </Text>
                        </View>
                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{ false: "#d1d5db", true: colors.primary }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                {/* Управление данными */}
                <View
                    style={[
                        styles.section,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                        УПРАВЛЕНИЕ ДАННЫМИ CONVEX
                    </Text>

                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ paddingVertical: 12 }} />
                    ) : (
                        <>
                            {/* Кнопка 1: Удалить выполненные */}
                            {confirmState === "completed" ? (
                                <View style={styles.confirmBox}>
                                    <Text style={[styles.confirmText, { color: colors.text }]}>
                                        Удалить {completedCount} выполн. задач?
                                    </Text>
                                    <View style={styles.confirmButtons}>
                                        <TouchableOpacity
                                            style={[styles.btnConfirm, { backgroundColor: colors.danger }]}
                                            onPress={handleExecuteCompleted}
                                        >
                                            <Text style={styles.btnConfirmText}>Да, удалить</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.btnCancel, { borderColor: colors.border }]}
                                            onPress={() => setConfirmState("none")}
                                        >
                                            <Text style={{ color: colors.text }}>Отмена</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.btnAction, !hasCompleted && styles.btnDisabled]}
                                    onPress={() => setConfirmState("completed")}
                                    disabled={!hasCompleted}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="checkmark-done-circle-outline"
                                        size={20}
                                        color={hasCompleted ? colors.danger : colors.textMuted}
                                    />
                                    <Text
                                        style={[
                                            styles.btnActionText,
                                            { color: hasCompleted ? colors.danger : colors.textMuted },
                                        ]}
                                    >
                                        Удалить выполненные ({completedCount})
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            {/* Кнопка 2: Удалить все */}
                            {confirmState === "all" ? (
                                <View style={styles.confirmBox}>
                                    <Text style={[styles.confirmText, { color: colors.text }]}>
                                        Удалить ВСЕ ({totalCount}) задач?
                                    </Text>
                                    <View style={styles.confirmButtons}>
                                        <TouchableOpacity
                                            style={[styles.btnConfirm, { backgroundColor: colors.danger }]}
                                            onPress={handleExecuteAll}
                                        >
                                            <Text style={styles.btnConfirmText}>Да, очистить всё</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.btnCancel, { borderColor: colors.border }]}
                                            onPress={() => setConfirmState("none")}
                                        >
                                            <Text style={{ color: colors.text }}>Отмена</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.btnAction, !hasTodos && styles.btnDisabled]}
                                    onPress={() => setConfirmState("all")}
                                    disabled={!hasTodos}
                                    activeOpacity={0.7}
                                >
                                    <Ionicons
                                        name="trash-bin-outline"
                                        size={20}
                                        color={hasTodos ? colors.danger : colors.textMuted}
                                    />
                                    <Text
                                        style={[
                                            styles.btnActionText,
                                            { color: hasTodos ? colors.danger : colors.textMuted },
                                        ]}
                                    >
                                        Удалить абсолютно все ({totalCount})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                </View>

                {/* Информация */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textMuted }]}>
                        Todo App v3.0 (Convex Cloud Edition)
                    </Text>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1 },
    container: { flex: 1, padding: 16 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    section: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16 },
    sectionTitle: { fontSize: 12, fontWeight: "bold", marginBottom: 12, letterSpacing: 0.5 },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    rowLabel: { flexDirection: "row", alignItems: "center", gap: 10 },
    rowText: { fontSize: 16, fontWeight: "500" },
    btnAction: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
    btnActionText: { fontSize: 16 },
    btnDisabled: { opacity: 0.4 },
    divider: { height: 1, marginVertical: 10 },
    footer: { marginTop: "auto", alignItems: "center", paddingVertical: 12 },
    footerText: { fontSize: 12 },
    confirmBox: { paddingVertical: 4, gap: 8 },
    confirmText: { fontSize: 14, fontWeight: "600" },
    confirmButtons: { flexDirection: "row", gap: 10 },
    btnConfirm: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    btnConfirmText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
    btnCancel: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
});