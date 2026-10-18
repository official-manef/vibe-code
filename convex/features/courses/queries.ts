import { query } from "../../_generated/server";
import { ConvexError, v } from "convex/values";
import { currentUser } from "../../_shared/auth";
import { course, courseFields, lessonSummary, lessonSummaryFields } from "../../_shared/validators";
import { enrollment } from "./access";

export const list = query({
  args: {},
  returns: v.array(course),
  handler: async (ctx) => await ctx.db.query("courses").take(50),
});

export const getById = query({
  args: { id: v.id("courses") },
  returns: v.union(v.object({ ...courseFields, lessons: v.array(lessonSummary) }), v.null()),
  handler: async (ctx, args) => {
    const course = await ctx.db.get(args.id);
    if (!course) return null;
    const lessons = await ctx.db.query("lessons")
      .withIndex("by_course", q => q.eq("courseId", args.id)).take(1001);
    if (lessons.length > 1000) throw new ConvexError("Course lesson limit exceeded");
    return {
      ...course,
      lessons: lessons.sort((a, b) => a.order - b.order).map(lesson => ({
        _id: lesson._id, _creationTime: lesson._creationTime, courseId: lesson.courseId,
        title: lesson.title, order: lesson.order,
      })),
    };
  },
});

export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  returns: v.union(v.object({ ...lessonSummaryFields, content: v.string(), completed: v.boolean(), canComplete: v.boolean() }), v.null()),
  handler: async (ctx, args) => {
    const user = await currentUser(ctx);
    if (!user) return null;
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) return null;
    const course = await ctx.db.get(lesson.courseId);
    if (!course) return null;
    const enrolled = !!await enrollment(ctx, user._id, course._id);
    if (!enrolled && !(user.role === "TEACHER" && course.teacherId === user._id)) return null;
    const progress = await ctx.db.query("progress")
      .withIndex("by_user_lesson", q => q.eq("userId", user._id).eq("lessonId", args.lessonId))
      .first();
    return { ...lesson, completed: progress?.completed ?? false, canComplete: enrolled };
  },
});
