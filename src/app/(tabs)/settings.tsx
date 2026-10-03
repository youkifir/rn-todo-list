import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();
    const { clearCompleted, clearAll, todos } = useTodos();

    const handleClearCompleted = () => {
        Alert.alert(
            "Підтвердження",
            "Ви дійсно бажаєте видалити всі виконані завдання?",
            [
                { text: "Скасувати", style: "cancel" },
                { text: "Видалити", style: "destructive", onPress: clearCompleted },
            ]
        );
    };

    const handleClearAll = () => {
        Alert.alert(
            "Увага!",
            "Ви дійсно бажаєте видалити ВСІ завдання? Цю дію неможливо скасувати.",
            [
                { text: "Скасувати", style: "cancel" },
                { text: "Видалити все", style: "destructive", onPress: clearAll },
            ]
        );
    };

    const hasCompleted = todos.some((t) => t.completed);
    const hasTodos = todos.length > 0;

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>Налаштування</Text>

                {/* Перемикач теми */}
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
                                {isDarkMode ? "Темна тема" : "Світла тема"}
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

                {/* Дії із завданнями */}
                <View
                    style={[
                        styles.section,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                    ]}
                >
                    <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
                        КЕРУВАННЯ ДАНИМИ
                    </Text>

                    <TouchableOpacity
                        style={[styles.btnAction, !hasCompleted && styles.btnDisabled]}
                        onPress={handleClearCompleted}
                        disabled={!hasCompleted}
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
                            Видалити виконані завдання
                        </Text>
                    </TouchableOpacity>

                    <View style={[styles.divider, { backgroundColor: colors.border }]} />

                    <TouchableOpacity
                        style={[styles.btnAction, !hasTodos && styles.btnDisabled]}
                        onPress={handleClearAll}
                        disabled={!hasTodos}
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
                            Видалити всі завдання
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Інформація */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, { color: colors.textMuted }]}>
                        Todo App v2.0.0 (React Native & Expo Router)
                    </Text>
                </View>
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
        padding: 16,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 20,
    },
    section: {
        borderRadius: 12,
        borderWidth: 1,
        padding: 16,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: "bold",
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    rowLabel: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    rowText: {
        fontSize: 16,
        fontWeight: "500",
    },
    btnAction: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        gap: 10,
    },
    btnActionText: {
        fontSize: 16,
    },
    btnDisabled: {
        opacity: 0.5,
    },
    divider: {
        height: 1,
        marginVertical: 10,
    },
    footer: {
        marginTop: "auto",
        alignItems: "center",
        paddingVertical: 12,
    },
    footerText: {
        fontSize: 12,
    },
});