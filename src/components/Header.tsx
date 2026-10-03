import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
    totalCount: number;
    completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Мои задачи</Text>
            <View style={styles.badge}>
                <Text style={styles.badgeText}>
                    {completedCount} из {totalCount}
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
        color: "#1f2937",
    },
    badge: {
        backgroundColor: "#e0e7ff",
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    badgeText: {
        color: "#4f46e5",
        fontSize: 14,
        fontWeight: "600",
    },
});