import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, expect, test, vi } from "vitest";
import { getFunctionName } from "convex/server";
import { LessonView } from "../frontend/slices/courses/ui/LessonView";
import { StudentDashboard } from "../frontend/slices/dashboard/ui/StudentDashboard";
import { TeacherDashboard } from "../frontend/slices/dashboard/ui/TeacherDashboard";
import { Providers } from "../src/components/Providers";
import type { Id } from "../convex/_generated/dataModel";

vi.mock("convex/react", () => ({
  useQuery: (reference: Parameters<typeof getFunctionName>[0]) => {
    if (getFunctionName(reference) === "features/auth/queries:me") return null;
    return undefined;
  },
  useMutation: () => vi.fn(),
  ConvexProvider: () => null,
  ConvexReactClient: class { constructor() { throw new Error("Unexpected backend connection"); } },
}));
afterEach(() => vi.unstubAllEnvs());

test("signed-out lesson and dashboards explain access instead of waiting indefinitely", () => {
  for (const element of [
    <LessonView key="lesson" courseId={"course" as Id<"courses">} lessonId={"lesson" as Id<"lessons">} />,
    <StudentDashboard key="student" />,
    <TeacherDashboard key="teacher" />,
  ]) {
    const html = renderToStaticMarkup(element);
    expect(html).toContain("role=\"status\"");
    expect(html).toContain("Formulir masuk belum tersedia");
    expect(html).not.toContain("Loading");
  }
});

test("missing backend configuration shows setup guidance without starting a dummy connection", () => {
  vi.stubEnv("NEXT_PUBLIC_CONVEX_URL", "");
  const html = renderToStaticMarkup(<Providers><p>Protected child</p></Providers>);
  expect(html).toContain("Backend belum dikonfigurasi");
  expect(html).not.toContain("Protected child");
});
