import { convexTest } from "convex-test";
import { expect, test } from "vitest";
import { api } from "../convex/_generated/api";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

test("anonymous users never inherit the seeded first teacher identity", async () => {
  const t = convexTest(schema, modules);
  await t.run(ctx => ctx.db.insert("users", { name: "Seed teacher", email: "teacher@example.test", role: "TEACHER" }));
  expect(await t.query(api.features.auth.queries.me, {})).toBeNull();
  await expect(t.mutation(api.features.courses.mutations.create, { title: "Intrusion", description: "Anonymous" })).rejects.toThrow();
});

async function fixture() {
  const t = convexTest(schema, modules);
  const ids = await t.run(async ctx => {
    const teacher = await ctx.db.insert("users", { email: "teacher@example.test", role: "TEACHER", tokenIdentifier: "https://issuer.example.test|teacher" });
    const otherTeacher = await ctx.db.insert("users", { email: "other@example.test", role: "TEACHER", tokenIdentifier: "https://issuer.example.test|other" });
    const student = await ctx.db.insert("users", { email: "student@example.test", role: "STUDENT", tokenIdentifier: "https://issuer.example.test|student" });
    const otherStudent = await ctx.db.insert("users", { email: "second@example.test", role: "STUDENT", tokenIdentifier: "https://issuer.example.test|second" });
    const course = await ctx.db.insert("courses", { title: "Public course", description: "Public overview", teacherId: teacher });
    const otherCourse = await ctx.db.insert("courses", { title: "Other course", description: "Overview", teacherId: otherTeacher });
    const lesson = await ctx.db.insert("lessons", { courseId: course, title: "Public curriculum title", content: "PRIVATE LESSON BODY", order: 1 });
    const otherLesson = await ctx.db.insert("lessons", { courseId: otherCourse, title: "Other lesson", content: "OTHER PRIVATE BODY", order: 1 });
    return { teacher, otherTeacher, student, otherStudent, course, otherCourse, lesson, otherLesson };
  });
  const identity = (subject: string) => t.withIdentity({ issuer: "https://issuer.example.test", subject, tokenIdentifier: `https://issuer.example.test|${subject}` });
  return { t, ids, teacher: identity("teacher"), otherTeacher: identity("other"), student: identity("student"), otherStudent: identity("second") };
}

test("anonymous and unprovisioned identities cannot call private endpoints or match by email", async () => {
  const { t, ids } = await fixture();
  const unknown = t.withIdentity({ tokenIdentifier: "https://issuer.example.test|unknown", email: "teacher@example.test" });
  for (const caller of [t, unknown]) {
    expect(await caller.query(api.features.auth.queries.me, {})).toBeNull();
    expect(await caller.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toBeNull();
    await expect(caller.query(api.features.dashboard.queries.getStudentDashboard, {})).rejects.toThrow();
    await expect(caller.query(api.features.dashboard.queries.getTeacherDashboard, {})).rejects.toThrow();
    await expect(caller.mutation(api.features.courses.mutations.create, { title: "No", description: "No" })).rejects.toThrow();
    await expect(caller.mutation(api.features.courses.mutations.addLesson, { courseId: ids.course, title: "No", content: "No", order: 2 })).rejects.toThrow();
    await expect(caller.mutation(api.features.courses.mutations.enroll, { courseId: ids.course })).rejects.toThrow();
    await expect(caller.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson })).rejects.toThrow();
  }
  expect(await t.run(ctx => ctx.db.query("enrollments").take(10))).toEqual([]);
  expect(await t.run(ctx => ctx.db.query("progress").take(10))).toEqual([]);
});

test("identity binding is exact, duplicate bindings fail closed, and identity keys stay private", async () => {
  const { t, ids, student } = await fixture();
  expect(await student.query(api.features.auth.queries.me, {})).toMatchObject({ _id: ids.student, role: "STUDENT" });
  expect(await student.query(api.features.auth.queries.me, {})).not.toHaveProperty("tokenIdentifier");
  const otherIssuer = t.withIdentity({ issuer: "https://other-issuer.example.test", subject: "student", tokenIdentifier: "https://other-issuer.example.test|student" });
  expect(await otherIssuer.query(api.features.auth.queries.me, {})).toBeNull();
  await t.run(ctx => ctx.db.insert("users", { email: "duplicate@example.test", role: "TEACHER", tokenIdentifier: "https://issuer.example.test|student" }));
  expect(await student.query(api.features.auth.queries.me, {})).toBeNull();
  await expect(student.mutation(api.features.courses.mutations.enroll, { courseId: ids.course })).rejects.toThrow();
});

test("client identity role/email claims cannot promote a student or bind an invalid stored role", async () => {
  const { t, ids } = await fixture();
  const forgedClaims = t.withIdentity({ tokenIdentifier: "https://issuer.example.test|student", role: "TEACHER", email: "teacher@example.test" });
  expect(await forgedClaims.query(api.features.auth.queries.me, {})).toMatchObject({ _id: ids.student, role: "STUDENT" });
  await expect(forgedClaims.mutation(api.features.courses.mutations.create, { title: "No", description: "No" })).rejects.toThrow();
  await t.run(ctx => ctx.db.patch(ids.student, { role: "ADMIN" }));
  expect(await forgedClaims.query(api.features.auth.queries.me, {})).toBeNull();
  await expect(forgedClaims.mutation(api.features.courses.mutations.enroll, { courseId: ids.course })).rejects.toThrow();
});

test("catalog and curriculum stay public without exposing lesson content or progress", async () => {
  const { t, ids } = await fixture();
  expect(await t.query(api.features.courses.queries.list, {})).toHaveLength(2);
  const detail = await t.query(api.features.courses.queries.getById, { id: ids.course });
  expect(detail?.lessons[0]).toMatchObject({ title: "Public curriculum title", order: 1 });
  expect(detail?.lessons[0]).not.toHaveProperty("content");
  expect(detail?.lessons[0]).not.toHaveProperty("completed");
  expect(JSON.stringify(detail)).not.toContain("PRIVATE LESSON BODY");
});

test("only a course's owning teacher can add lessons and see its unenrolled content", async () => {
  const { t, ids, teacher, otherTeacher, student } = await fixture();
  for (const caller of [otherTeacher, student]) {
    await expect(caller.mutation(api.features.courses.mutations.addLesson, { courseId: ids.course, title: "Intrusion", content: "No", order: 2 })).rejects.toThrow();
    expect(await caller.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toBeNull();
  }
  await expect(student.mutation(api.features.courses.mutations.create, { title: "No", description: "No" })).rejects.toThrow();
  await expect(student.query(api.features.dashboard.queries.getTeacherDashboard, {})).rejects.toThrow();
  const added = await teacher.mutation(api.features.courses.mutations.addLesson, { courseId: ids.course, title: "Owned lesson", content: "Owned content", order: 2 });
  expect((await t.run(ctx => ctx.db.get(added)))?.courseId).toBe(ids.course);
  expect(await teacher.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toMatchObject({ content: "PRIVATE LESSON BODY", canComplete: false });
  await expect(teacher.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson })).rejects.toThrow();
  const created = await teacher.mutation(api.features.courses.mutations.create, { title: "Owned course", description: "Overview" });
  expect((await t.run(ctx => ctx.db.get(created)))?.teacherId).toBe(ids.teacher);
  expect((await otherTeacher.query(api.features.dashboard.queries.getTeacherDashboard, {})).courses.map(course => course._id)).toEqual([ids.otherCourse]);
});

test("enrollment and completion are bound to the caller and lesson's actual course", async () => {
  const { t, ids, student, otherStudent } = await fixture();
  await expect(student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson })).rejects.toThrow();
  const enrollment = await student.mutation(api.features.courses.mutations.enroll, { courseId: ids.course });
  expect(await student.mutation(api.features.courses.mutations.enroll, { courseId: ids.course })).toBe(enrollment);
  expect((await t.run(ctx => ctx.db.get(enrollment)))?.userId).toBe(ids.student);
  await expect(student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.otherLesson })).rejects.toThrow();
  expect(await student.query(api.features.courses.queries.getLesson, { lessonId: ids.otherLesson })).toBeNull();
  const progress = await student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson });
  expect(await student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson })).toBe(progress);
  expect((await t.run(ctx => ctx.db.get(progress)))?.userId).toBe(ids.student);
  expect(await otherStudent.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toBeNull();
  await otherStudent.mutation(api.features.courses.mutations.enroll, { courseId: ids.course });
  expect(await student.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toMatchObject({ completed: true, canComplete: true });
  expect(await otherStudent.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson })).toMatchObject({ completed: false, canComplete: true });
  expect((await student.query(api.features.dashboard.queries.getStudentDashboard, {})).courses[0].completedLessons).toBe(1);
  expect((await otherStudent.query(api.features.dashboard.queries.getStudentDashboard, {})).courses[0].completedLessons).toBe(0);
  await expect(otherStudent.query(api.features.courses.queries.getLesson, { lessonId: ids.lesson, userId: ids.student } as never)).rejects.toThrow();
});

test("deleted courses and lessons cannot create dangling enrollments or progress", async () => {
  const { t, ids, teacher, student } = await fixture();
  await t.run(ctx => ctx.db.delete(ids.otherCourse));
  await expect(student.mutation(api.features.courses.mutations.enroll, { courseId: ids.otherCourse })).rejects.toThrow();
  await expect(student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.otherLesson })).rejects.toThrow();
  await expect(teacher.mutation(api.features.courses.mutations.addLesson, { courseId: ids.otherCourse, title: "No", content: "No", order: 2 })).rejects.toThrow();
  expect(await student.query(api.features.courses.queries.getLesson, { lessonId: ids.otherLesson })).toBeNull();
  await t.run(ctx => ctx.db.delete(ids.lesson));
  await expect(student.mutation(api.features.courses.mutations.completeLesson, { lessonId: ids.lesson })).rejects.toThrow();
});
