import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.optional(v.string()),
    email: v.string(),
    role: v.string(), // "STUDENT" | "TEACHER"
  }).index("by_email", ["email"]),

  courses: defineTable({
    title: v.string(),
    description: v.string(),
    teacherId: v.id("users"),
  }).index("by_teacher", ["teacherId"]),

  lessons: defineTable({
    courseId: v.id("courses"),
    title: v.string(),
    content: v.string(),
    order: v.number(),
  }).index("by_course", ["courseId"]),

  enrollments: defineTable({
    userId: v.id("users"),
    courseId: v.id("courses"),
  }).index("by_user_course", ["userId", "courseId"]),

  progress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    completed: v.boolean(),
  }).index("by_user_lesson", ["userId", "lessonId"]),
});
