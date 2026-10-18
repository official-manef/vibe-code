import { query } from "../../_generated/server";
import { ConvexError, v } from "convex/values";
import { publicUser, requireUser, requireAdmin } from "../../_shared/auth";
import { course, courseFields, user } from "../../_shared/validators";

export const getStudentDashboard = query({
  args: {},
  returns: v.object({
    user,
    courses: v.array(v.object({ ...courseFields, totalLessons: v.number(), completedLessons: v.number() })),
  }),
  handler: async (ctx) => {
    const authenticated = await requireUser(ctx);
    const enrollments = await ctx.db.query("enrollments")
      .withIndex("by_user_course", q => q.eq("userId", authenticated._id)).take(101);
    if (enrollments.length > 100) throw new ConvexError("Dashboard course limit exceeded");
    const courses = [];
    let lessonCount = 0;
    for (const enrolled of enrollments) {
      const course = await ctx.db.get(enrolled.courseId);
      if (!course) continue;
      const lessons = await ctx.db.query("lessons")
        .withIndex("by_course", q => q.eq("courseId", course._id)).take(1001);
      lessonCount += lessons.length;
      if (lessonCount > 1000) throw new ConvexError("Dashboard lesson limit exceeded");
      let completedLessons = 0;
      for (const lesson of lessons) {
        const progress = await ctx.db.query("progress")
          .withIndex("by_user_lesson", q => q.eq("userId", authenticated._id).eq("lessonId", lesson._id)).first();
        if (progress?.completed) completedLessons++;
      }
      courses.push({ ...course, totalLessons: lessons.length, completedLessons });
    }
    return { user: publicUser(authenticated), courses };
  },
});

export const getTeacherDashboard = query({
  args: {},
  returns: v.object({ user, courses: v.array(course) }),
  handler: async (ctx) => {
    const authenticated = await requireAdmin(ctx);
    const courses = await ctx.db.query("courses")
      .withIndex("by_teacher", q => q.eq("teacherId", authenticated._id)).take(101);
    if (courses.length > 100) throw new ConvexError("Dashboard course limit exceeded");
    return { user: publicUser(authenticated), courses };
  },
});
