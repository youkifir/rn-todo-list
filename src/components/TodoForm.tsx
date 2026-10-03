import { useState } from "react";
import {
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface TodoFormProps {
    onAdd: (text: string) => Promise<void>;
    loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
    const [text, setText] = useState("");

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

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Что нужно сделать?"
                placeholderTextColor="#9ca3af"
                value={text}
                onChangeText={setText}
                onSubmitEditing={handleSubmit}
                returnKeyType="done"
            />
            <TouchableOpacity
                style={[styles.button, (!text.trim() || loading) && styles.buttonDisabled]}
                onPress={handleSubmit}
                disabled={!text.trim() || loading}
            >
                <Text style={styles.buttonText}>Добавить</Text>
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
        backgroundColor: "#f3f4f6",
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: "#1f2937",
    },
    button: {
        height: 48,
        backgroundColor: "#6366f1",
        borderRadius: 8,
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
    },
    buttonDisabled: {
        backgroundColor: "#a5b4fc",
    },
    buttonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "600",
    },
});