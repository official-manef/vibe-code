import { Suspense } from "react";
import { LessonView } from "@/features/courses/ui/LessonView";
import type { Id } from "../../../../../../convex/_generated/dataModel";

export default async function LessonPage({ params }: { params: Promise<{ courseId: string; lessonId: string }> }) {
  const { courseId, lessonId } = await params;
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <LessonView courseId={courseId as Id<"courses">} lessonId={lessonId as Id<"lessons">} />
    </Suspense>
  );
}
