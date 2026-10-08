// convex/users.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

export const currentUser = query({
    args: {},
    handler: async (ctx) => {
        const userId = await getAuthUserId(ctx);
        if (userId === null) {
            return null;
        }
        // ctx.db.get принимает Id любой таблицы из вашей schema
        return await ctx.db.get(userId);
    },
});