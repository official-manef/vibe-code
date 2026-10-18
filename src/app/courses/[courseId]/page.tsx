import { Suspense } from "react";
import { Detail } from "@/features/courses/ui/Detail";
import type { Id } from "../../../../convex/_generated/dataModel";

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return (
    <Suspense fallback={<div className="p-20 text-center">Loading...</div>}>
      <Detail courseId={courseId as Id<"courses">} />
    </Suspense>
  );
}
