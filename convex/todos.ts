import { getAuthUserId } from "@convex-dev/auth/server";
import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// 1. Получение задач ТОЛЬКО авторизованного пользователя
export const getTodos = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return [];
        }

        return await ctx.db
            .query("todos")
            .withIndex("by_user_creation", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
    },
});

// 2. Статистика текущего пользователя
export const getStats = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return { total: 0, completed: 0, active: 0, percentage: 0 };
        }

        const todos = await ctx.db
            .query("todos")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        const total = todos.length;
        const completed = todos.filter((t) => t.isCompleted).length;
        const active = total - completed;
        const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

        return { total, completed, active, percentage };
    },
});

// 3. Создание задачи для текущего пользователя
export const createTodo = mutation({
    args: {
        text: v.string(),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Необходимо авторизоваться");
        }

        const trimmedText = args.text.trim();
        if (trimmedText.length === 0) {
            throw new ConvexError("Текст задачи не может быть пустым");
        }

        return await ctx.db.insert("todos", {
            userId,
            text: trimmedText,
            isCompleted: false,
            createdAt: Date.now(),
        });
    },
});

// 4. Переключение статуса задачи
export const toggleTodo = mutation({
    args: {
        id: v.id("todos"),
    },
    handler: async (ctx, args) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Не авторизовано");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo || todo.userId !== userId) {
            throw new ConvexError("Задача не найдена или нет доступа");
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
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Не авторизовано");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo || todo.userId !== userId) {
            throw new ConvexError("Задача не найдена или нет доступа");
        }

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
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Не авторизовано");
        }

        const todo = await ctx.db.get(args.id);
        if (!todo || todo.userId !== userId) {
            throw new ConvexError("Задача не найдена или нет доступа");
        }

        await ctx.db.delete(args.id);
    },
});

// 7. Очистка выполненных задач пользователя
export const clearCompleted = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Не авторизовано");
        }

        const completedTodos = await ctx.db
            .query("todos")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .filter((q) => q.eq(q.field("isCompleted"), true))
            .collect();

        for (const todo of completedTodos) {
            await ctx.db.delete(todo._id);
        }

        return { deletedCount: completedTodos.length };
    },
});

// 8. Очистка всех задач пользователя
export const clearAll = mutation({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            throw new ConvexError("Не авторизовано");
        }

        const all = await ctx.db
            .query("todos")
            .withIndex("by_user", (q) => q.eq("userId", userId))
            .collect();

        for (const todo of all) {
            await ctx.db.delete(todo._id);
        }

        return { deletedCount: all.length };
    },
});