import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";
import type { Todo } from "@/types";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const { colors } = useTheme();

    const handleSaveEdit = async () => {
        const trimmedText = editText.trim();
        if (trimmedText && trimmedText !== todo.text) {
            await onEdit(todo.id, trimmedText);
        } else {
            setEditText(todo.text);
        }
        setIsEditing(false);
    };

    return (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
        >
            <TouchableOpacity onPress={() => onToggle(todo.id)} style={styles.checkboxWrapper}>
                <Ionicons
                    name={todo.completed ? "checkmark-circle" : "ellipse-outline"}
                    size={24}
                    color={todo.completed ? colors.success : colors.textMuted}
                />
            </TouchableOpacity>

            {isEditing ? (
                <TextInput
                    style={[
                        styles.editInput,
                        { color: colors.text, borderBottomColor: colors.primary },
                    ]}
                    value={editText}
                    onChangeText={setEditText}
                    onBlur={handleSaveEdit}
                    onSubmitEditing={handleSaveEdit}
                    autoFocus
                />
            ) : (
                <TouchableOpacity
                    style={styles.textWrapper}
                    onPress={() => setIsEditing(true)}
                >
                    <Text
                        style={[
                            styles.todoText,
                            { color: colors.text },
                            todo.completed && [styles.completedText, { color: colors.textMuted }],
                        ]}
                    >
                        {todo.text}
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(todo.id)}
            >
                <Ionicons name="trash-outline" size={20} color={colors.danger} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
    },
    checkboxWrapper: {
        marginRight: 12,
    },
    textWrapper: {
        flex: 1,
    },
    todoText: {
        fontSize: 16,
    },
    completedText: {
        textDecorationLine: "line-through",
    },
    editInput: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
        borderBottomWidth: 1,
    },
    deleteButton: {
        padding: 6,
        marginLeft: 8,
    },
});