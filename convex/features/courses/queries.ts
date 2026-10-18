import { query } from "../../_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("courses").take(50);
  },
});

export const getById = query({
  args: { id: v.id("courses") },
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) return null;

    const lessons = await ctx.db
      .query("lessons")
      .withIndex("by_course", (q) => q.eq("courseId", args.id))
      .collect();

    return { ...course, lessons: lessons.sort((a, b) => a.order - b.order) };
  },
});

export const getLesson = query({
  args: { lessonId: v.id("lessons"), userId: v.id("users") },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) return null;

    const progress = await ctx.db
      .query("progress")
      .withIndex("by_user_lesson", (q) => q.eq("userId", args.userId).eq("lessonId", args.lessonId))
      .first();

    return { ...lesson, completed: progress?.completed ?? false };
  },
});
