import { v } from "convex/values";

export const user = v.object({
  _id: v.id("users"),
  _creationTime: v.number(),
  name: v.optional(v.string()),
  email: v.string(),
  role: v.string(),
});

export const courseFields = {
  _id: v.id("courses"),
  _creationTime: v.number(),
  title: v.string(),
  description: v.string(),
  teacherId: v.id("users"),
};
export const course = v.object(courseFields);
export const lessonSummaryFields = {
  _id: v.id("lessons"),
  _creationTime: v.number(),
  courseId: v.id("courses"),
  title: v.string(),
  order: v.number(),
};
export const lessonSummary = v.object(lessonSummaryFields);
