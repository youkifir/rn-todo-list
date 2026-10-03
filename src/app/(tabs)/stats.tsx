import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function StatsScreen() {
    const { colors } = useTheme();
    const { todos } = useTodos();

    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const active = total - completed;
    const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const cards = [
        {
            title: "Всього завдань",
            value: total,
            icon: "list" as const,
            color: colors.primary,
        },
        {
            title: "В процесі",
            value: active,
            icon: "time" as const,
            color: "#f59e0b",
        },
        {
            title: "Виконано",
            value: completed,
            icon: "checkmark-done" as const,
            color: colors.success,
        },
        {
            title: "Прогрес",
            value: `${progressPercent}%`,
            icon: "trending-up" as const,
            color: "#3b82f6",
        },
    ];

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.bg }]}>
            <View style={styles.container}>
                <Text style={[styles.title, { color: colors.text }]}>
                    Статистика продуктивності
                </Text>

                <View style={styles.grid}>
                    {cards.map((card, index) => (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                { backgroundColor: colors.surface, borderColor: colors.border },
                            ]}
                        >
                            <View
                                style={[
                                    styles.iconBadge,
                                    { backgroundColor: card.color + "20" },
                                ]}
                            >
                                <Ionicons name={card.icon} size={24} color={card.color} />
                            </View>
                            <Text style={[styles.cardValue, { color: colors.text }]}>
                                {card.value}
                            </Text>
                            <Text style={[styles.cardTitle, { color: colors.textMuted }]}>
                                {card.title}
                            </Text>
                        </View>
                    ))}
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
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    card: {
        width: "48%",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: "center",
    },
    iconBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 12,
    },
    cardValue: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 4,
    },
    cardTitle: {
        fontSize: 14,
    },
});