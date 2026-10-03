import type { Todo } from "@/types";
import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);

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
        <View style={styles.card}>
            <TouchableOpacity
                style={[styles.checkbox, todo.completed && styles.checkboxChecked]}
                onPress={() => onToggle(todo.id, !todo.completed)}
            >
                {todo.completed && <Text style={styles.checkmark}>✓</Text>}
            </TouchableOpacity>

            {isEditing ? (
                <TextInput
                    style={styles.editInput}
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
                        style={[styles.todoText, todo.completed && styles.todoTextCompleted]}
                    >
                        {todo.text}
                    </Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(todo.id)}
            >
                <Text style={styles.deleteText}>✕</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ffffff",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: "#6366f1",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },
    checkboxChecked: {
        backgroundColor: "#6366f1",
    },
    checkmark: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "bold",
    },
    textWrapper: {
        flex: 1,
    },
    todoText: {
        fontSize: 16,
        color: "#1f2937",
    },
    todoTextCompleted: {
        textDecorationLine: "line-through",
        color: "#9ca3af",
    },
    editInput: {
        flex: 1,
        fontSize: 16,
        color: "#1f2937",
        paddingVertical: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#6366f1",
    },
    deleteButton: {
        padding: 6,
        marginLeft: 8,
    },
    deleteText: {
        color: "#ef4444",
        fontSize: 16,
        fontWeight: "bold",
    },
});