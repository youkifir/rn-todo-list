import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // 1. Автоматически подключаем таблицы users, authSessions, authAccounts и т.д.
  ...authTables,

  // 2. Таблица задач с обязательной привязкой к userId
  todos: defineTable({
    userId: v.id("users"),
    text: v.string(),
    isCompleted: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_creation", ["userId", "createdAt"]),
});