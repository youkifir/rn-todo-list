// app/(tabs)/settings.tsx
import React, { useState } from "react";
import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const { signOut } = useAuthActions();

    // Запрос данных текущего пользователя и его задач
    const user = useQuery(api.users.currentUser);
    const todos = useQuery(api.todos.getTodos);

    const clearCompleted = useMutation(api.todos.clearCompleted);
    const clearAll = useMutation(api.todos.clearAll);

    const [confirmState, setConfirmState] = useState<"none" | "completed" | "all">("none");

    const isLoading = todos === undefined;
    const completedCount = todos?.filter((t) => t.isCompleted).length ?? 0;
    const totalCount = todos?.length ?? 0;

    const handleSignOut = () => {
        Alert.alert("Вихід", "Ви дійсно бажаєте вийти з облікового запису?", [
            { text: "Скасувати", style: "cancel" },
            {
                text: "Вийти",
                style: "destructive",
                onPress: async () => {
                    try {
                        await signOut();
                    } catch (error) {
                        console.error("Помилка при виході:", error);
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Налаштування</Text>

                {/* Профіль користувача */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ОБЛІКОВИЙ ЗАПИС</Text>
                    <View style={styles.profileRow}>
                        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
                            <Text style={styles.avatarText}>
                                {user?.name ? user.name[0].toUpperCase() : user?.email ? user.email[0].toUpperCase() : "U"}
                            </Text>
                        </View>
                        <View style={styles.profileInfo}>
                            <Text style={[styles.userName, { color: colors.text }]}>{user?.name || "Користувач"}</Text>
                            <Text style={[styles.userEmail, { color: colors.textMuted }]}>{user?.email || ""}</Text>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
                        <Ionicons name="log-out-outline" size={20} color={colors.danger} />
                        <Text style={[styles.signOutText, { color: colors.danger }]}>Вийти з акаунту</Text>
                    </TouchableOpacity>
                </View>

                {/* Перемикач теми */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <View style={styles.row}>
                        <View style={styles.rowLabel}>
                            <Ionicons name={isDarkMode ? "moon" : "sunny"} size={22} color={colors.primary} />
                            <Text style={[styles.rowText, { color: colors.text }]}>
                                {isDarkMode ? "Тємна тема" : "Світла тема"}
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

                {/* Управління даними */}
                <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>УПРАВЛІННЯ ДАНИМИ CONVEX</Text>

                    {isLoading ? (
                        <ActivityIndicator color={colors.primary} style={{ paddingVertical: 12 }} />
                    ) : (
                        <>
                            {confirmState === "completed" ? (
                                <View style={styles.confirmBox}>
                                    <Text style={[styles.confirmText, { color: colors.text }]}>
                                        Видалити {completedCount} виконаних завдань?
                                    </Text>
                                    <View style={styles.confirmButtons}>
                                        <TouchableOpacity
                                            style={[styles.btnConfirm, { backgroundColor: colors.danger }]}
                                            onPress={async () => {
                                                await clearCompleted();
                                                setConfirmState("none");
                                            }}
                                        >
                                            <Text style={styles.btnConfirmText}>Так, видалити</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.btnCancel, { borderColor: colors.border }]}
                                            onPress={() => setConfirmState("none")}
                                        >
                                            <Text style={{ color: colors.text }}>Скасувати</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.btnAction, completedCount === 0 && styles.btnDisabled]}
                                    onPress={() => setConfirmState("completed")}
                                    disabled={completedCount === 0}
                                >
                                    <Ionicons
                                        name="checkmark-done-circle-outline"
                                        size={20}
                                        color={completedCount > 0 ? colors.danger : colors.textMuted}
                                    />
                                    <Text style={[styles.btnActionText, { color: completedCount > 0 ? colors.danger : colors.textMuted }]}>
                                        Видалити виконані ({completedCount})
                                    </Text>
                                </TouchableOpacity>
                            )}

                            <View style={[styles.divider, { backgroundColor: colors.border }]} />

                            {confirmState === "all" ? (
                                <View style={styles.confirmBox}>
                                    <Text style={[styles.confirmText, { color: colors.text }]}>
                                        Видалити ВСІ ({totalCount}) завдань?
                                    </Text>
                                    <View style={styles.confirmButtons}>
                                        <TouchableOpacity
                                            style={[styles.btnConfirm, { backgroundColor: colors.danger }]}
                                            onPress={async () => {
                                                await clearAll();
                                                setConfirmState("none");
                                            }}
                                        >
                                            <Text style={styles.btnConfirmText}>Так, очистити все</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.btnCancel, { borderColor: colors.border }]}
                                            onPress={() => setConfirmState("none")}
                                        >
                                            <Text style={{ color: colors.text }}>Скасувати</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ) : (
                                <TouchableOpacity
                                    style={[styles.btnAction, totalCount === 0 && styles.btnDisabled]}
                                    onPress={() => setConfirmState("all")}
                                    disabled={totalCount === 0}
                                >
                                    <Ionicons
                                        name="trash-bin-outline"
                                        size={20}
                                        color={totalCount > 0 ? colors.danger : colors.textMuted}
                                    />
                                    <Text style={[styles.btnActionText, { color: totalCount > 0 ? colors.danger : colors.textMuted }]}>
                                        Видалити абсолютно всі ({totalCount})
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
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
    profileRow: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
    avatar: { width: 44, height: 44, borderRadius: 22, justifyContent: "center", alignItems: "center" },
    avatarText: { color: "#FFFFFF", fontSize: 18, fontWeight: "bold" },
    profileInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: "bold" },
    userEmail: { fontSize: 13 },
    signOutBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingTop: 8 },
    signOutText: { fontSize: 15, fontWeight: "600" },
    row: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
    rowLabel: { flexDirection: "row", alignItems: "center", gap: 10 },
    rowText: { fontSize: 16, fontWeight: "500" },
    btnAction: { flexDirection: "row", alignItems: "center", paddingVertical: 8, gap: 10 },
    btnActionText: { fontSize: 16 },
    btnDisabled: { opacity: 0.4 },
    divider: { height: 1, marginVertical: 10 },
    confirmBox: { paddingVertical: 4, gap: 8 },
    confirmText: { fontSize: 14, fontWeight: "600" },
    confirmButtons: { flexDirection: "row", gap: 10 },
    btnConfirm: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
    btnConfirmText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
    btnCancel: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, borderWidth: 1 },
});