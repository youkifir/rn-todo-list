import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
    totalCount: number;
    completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: colors.text }]}>Мій список завдань</Text>
            <View style={[styles.badge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>
                    {completedCount} з {totalCount}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
    },
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        fontSize: 14,
        fontWeight: "600",
    },
});