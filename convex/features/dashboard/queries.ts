import { query } from "../../_generated/server";
import { v } from "convex/values";
import { requireUser, requireAdmin } from "../../_shared/auth";

export const getStudentDashboard = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireUser(ctx);
    const enrollments = await ctx.db
      .query("enrollments")
      .withIndex("by_user_course", (q) => q.eq("userId", user._id))
      .collect();

    const courseDetails = await Promise.all(
      enrollments.map(async (e) => {
        const course = await ctx.db.get(e.courseId);
        const lessons = await ctx.db
          .query("lessons")
          .withIndex("by_course", (q) => q.eq("courseId", e.courseId))
          .collect();

        let completedCount = 0;
        for (const l of lessons) {
          const prog = await ctx.db
            .query("progress")
            .withIndex("by_user_lesson", (q) => q.eq("userId", user._id).eq("lessonId", l._id))
            .first();
          if (prog?.completed) completedCount++;
        }

        return {
          ...course,
          totalLessons: lessons.length,
          completedLessons: completedCount,
        };
      })
    );

    return { user, courses: courseDetails };
  },
});

export const getTeacherDashboard = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAdmin(ctx);
    const courses = await ctx.db
      .query("courses")
      .withIndex("by_teacher", (q) => q.eq("teacherId", user._id))
      .collect();

    return { user, courses };
  },
});
