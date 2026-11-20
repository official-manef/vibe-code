// This is a placeholder for actual @convex-dev/auth logic
// In a real app, we'd use ctx.auth.getUserIdentity()
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

type Ctx = QueryCtx | MutationCtx;

export async function requireUser(ctx: Ctx): Promise<Doc<"users">> {
  // For this demo, we'll auto-return a mock user
  const user = await ctx.db.query("users").first();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(ctx: Ctx): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "TEACHER") throw new Error("Forbidden");
  return user;
}
