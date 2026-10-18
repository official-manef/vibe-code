import type { Id } from "../../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../../_generated/server";

export async function enrollment(ctx: QueryCtx | MutationCtx, userId: Id<"users">, courseId: Id<"courses">) {
  return await ctx.db.query("enrollments")
    .withIndex("by_user_course", q => q.eq("userId", userId).eq("courseId", courseId))
    .first();
}
