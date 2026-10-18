import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { requireAdmin, requireUser } from "../../_shared/auth";

export const create = mutation({
  args: { title: v.string(), description: v.string() },
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    return await ctx.db.insert("courses", {
      ...args,
      teacherId: user._id,
    });
  },
});

export const addLesson = mutation({
  args: {
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(),
    order: v.number()
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return await ctx.db.insert("lessons", args);
  },
});

export const enroll = mutation({
  args: { courseId: v.id("courses") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", user._id).eq("courseId", args.courseId))
      .first();

    if (existing) return existing._id;
    return await ctx.db.insert("enrollments", {
      userId: user._id,
      courseId: args.courseId,
    });
  },
});

export const completeLesson = mutation({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const existing = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { completed: true });
      return existing._id;
    }

    return await ctx.db.insert("progress", {
      userId: user._id,
      lessonId: args.lessonId,
      completed: true,
    });
  },
});
