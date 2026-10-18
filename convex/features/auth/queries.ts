import { query } from "../../_generated/server";
import { v } from "convex/values";

// Returns the current user (mocked to the first user for now)
export const me = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").first();
  },
});
