import { ConvexError } from "convex/values";
import type { Doc } from "../_generated/dataModel";
import type { MutationCtx, QueryCtx } from "../_generated/server";

type AuthContext = QueryCtx | MutationCtx;

export async function currentUser(ctx: AuthContext): Promise<Doc<"users"> | null> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity?.tokenIdentifier) return null;
  const matches = await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", q => q.eq("tokenIdentifier", identity.tokenIdentifier))
    .take(2);
  if (matches.length !== 1) return null;
  const user = matches[0];
  return user.role === "STUDENT" || user.role === "TEACHER" ? user : null;
}

export async function requireUser(ctx: AuthContext): Promise<Doc<"users">> {
  const user = await currentUser(ctx);
  if (!user) throw new ConvexError("Authentication and account provisioning required");
  return user;
}

export async function requireAdmin(ctx: AuthContext): Promise<Doc<"users">> {
  const user = await requireUser(ctx);
  if (user.role !== "TEACHER") throw new ConvexError("Teacher role required");
  return user;
}

export function publicUser(user: Doc<"users">) {
  return {
    _id: user._id,
    _creationTime: user._creationTime,
    email: user.email,
    role: user.role,
    ...(user.name === undefined ? {} : { name: user.name }),
  };
}
