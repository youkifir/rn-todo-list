import { useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

interface TodoFormProps {
    onAdd: (text: string) => Promise<void>;
    loading?: boolean;
}

export function TodoForm({ onAdd, loading = false }: TodoFormProps) {
    const [text, setText] = useState("");
    const { colors } = useTheme();

    const handleSubmit = async () => {
        const trimmedText = text.trim();
        if (!trimmedText || loading) return;

        try {
            Keyboard.dismiss();
            await onAdd(trimmedText);
            setText("");
        } catch (error) {
            console.error(error);
        }
    };

    const isDisabled = !text.trim() || loading;

    return (
        <View style={styles.container}>
            <TextInput
                style={[
                    styles.input,
                    {
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.border,
                    },
                ]}
                placeholder="Що потрібно зробити?"
                placeholderTextColor={colors.textMuted}
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
            />
            <TouchableOpacity
                style={[
                    styles.button,
                    { backgroundColor: isDisabled ? colors.primary + "60" : colors.primary },
                ]}
                onPress={handleSubmit}
                disabled={isDisabled}
            >
                <Ionicons name="add" size={24} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        marginBottom: 16,
        gap: 10,
    },
    input: {
        flex: 1,
        height: 48,
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        borderWidth: 1,
    },
    button: {
        width: 48,
        height: 48,
        borderRadius: 8,
        justifyContent: "center",
        alignItems: "center",
    },
});