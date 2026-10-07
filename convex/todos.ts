import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";

// 1. Получение всех задач (от новых к старым)
export const getTodos = query({
    args: {},
    handler: async (ctx) => {
        return await ctx.db
            .query("todos")
            .withIndex("by_created_at") // ✅ ИСПРАВЛЕНО: совпадает с schema.ts
            .order("desc")
            .collect();
    },
});

// 2. Получение аналитики
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const allTodos = await ctx.db.query("todos").collect();
        const total = allTodos.length;
        const completed = allTodos.filter((t) => t.isCompleted).length;
        const active = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        return {
            total,
            completed,
            active,
            percentage,
        };
    },
});

// 3. Создание новой задачи
export const createTodo = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const trimmedText = args.text.trim();
        if (trimmedText.length === 0) {
            throw new ConvexError("Текст задачи не может быть пустым");
        }

        return await ctx.db.insert("todos", {
            text: trimmedText,
            isCompleted: false,
            createdAt: Date.now(),
        });
    },
});

// 4. Переключение статуса выполнения
export const toggleTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const todo = await ctx.db.get(args.id);
        if (!todo) {
            throw new ConvexError("Задача не найдена");
        }

        await ctx.db.patch(args.id, {
            isCompleted: !todo.isCompleted,
        });
    },
});

// 5. Обновление текста задачи
export const updateTodo = mutation({
    args: {
        id: v.id("todos"),
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const trimmed = args.text.trim();
        if (trimmed.length === 0) {
            throw new ConvexError("Текст задачи не может быть пустым");
        }

        await ctx.db.patch(args.id, {
            text: trimmed,
        });
    },
});

// 6. Удаление одной задачи
export const deleteTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

// 7. Удаление всех завершённых задач
export const clearCompleted = mutation({
    args: {},
    handler: async (ctx) => {
        const allTodos = await ctx.db.query("todos").collect();
        const completedTodos = allTodos.filter((t) => t.isCompleted);

        for (const todo of completedTodos) {
            await ctx.db.delete(todo._id);
        }

        return { deletedCount: completedTodos.length };
    },
});

// 8. Полное очищение списка
export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const all = await ctx.db.query("todos").collect();
        for (const todo of all) {
            await ctx.db.delete(todo._id);
        }
        return { deletedCount: all.length };
    },
});