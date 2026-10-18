import { mutation } from "../../_generated/server";
import { ConvexError, v } from "convex/values";
import { requireAdmin, requireUser } from "../../_shared/auth";
import { enrollment } from "./access";

export const create = mutation({
  args: { title: v.string(), description: v.string() },
  returns: v.id("courses"),
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    return await ctx.db.insert("courses", { ...args, teacherId: user._id });
  },
});

export const addLesson = mutation({
  args: { courseId: v.id("courses"), title: v.string(), content: v.string(), order: v.number() },
  returns: v.id("lessons"),
  handler: async (ctx, args) => {
    const user = await requireAdmin(ctx);
    const course = await ctx.db.get(args.courseId);
    if (!course || course.teacherId !== user._id) throw new ConvexError("Course ownership required");
    return await ctx.db.insert("lessons", args);
  },
});

export const enroll = mutation({
  args: { courseId: v.id("courses") },
  returns: v.id("enrollments"),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    if (!await ctx.db.get(args.courseId)) throw new ConvexError("Course not found");
    const existing = await enrollment(ctx, user._id, args.courseId);
    if (existing) return existing._id;
    return await ctx.db.insert("enrollments", { userId: user._id, courseId: args.courseId });
  },
});

export const completeLesson = mutation({
  args: { lessonId: v.id("lessons") },
  returns: v.id("progress"),
  handler: async (ctx, args) => {
    const user = await requireUser(ctx);
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson || !await ctx.db.get(lesson.courseId) || !await enrollment(ctx, user._id, lesson.courseId)) {
      throw new ConvexError("Course enrollment required");
    }
    const existing = await ctx.db.query("progress")
      .withIndex("by_user_lesson", q => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: true });
      return existing._id;
    }
    return await ctx.db.insert("progress", { userId: user._id, lessonId: args.lessonId, completed: true });
  },
});
