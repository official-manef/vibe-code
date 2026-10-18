"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { ChevronLeft, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function LessonView({
  courseId,
  lessonId
}: {
  courseId: Id<"courses">;
  lessonId: Id<"lessons">;
}) {
  const user = useQuery(api.features.auth.queries.me);
  const lesson = useQuery(api.features.courses.queries.getLesson,
    user ? { lessonId, userId: user._id } : "skip"
  );
  const complete = useMutation(api.features.courses.mutations.completeLesson);

  if (user === undefined || lesson === undefined) return <div className="p-20 text-center">Loading lesson...</div>;
  if (!lesson) return <div className="p-20 text-center">Lesson not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-8 lg:p-16">
      <Link href={`/courses/${courseId}`} className="text-gray-500 hover:text-black flex items-center gap-1 mb-8">
        <ChevronLeft size={16} /> Kembali ke Kursus
      </Link>
      <h1 className="text-4xl font-bold mb-8">{lesson.title}</h1>
      <div className="prose prose-blue max-w-none mb-12 text-gray-700 leading-relaxed whitespace-pre-wrap">
        {lesson.content}
      </div>
      <div className="pt-12 border-t flex justify-center">
        {!lesson.completed ? (
          <Button
            size="lg"
            className="rounded-2xl px-10 py-6 text-lg font-bold shadow-lg shadow-blue-100"
            onClick={() => complete({ lessonId })}
          >
            Tandai Selesai <CheckCircle className="ml-2" />
          </Button>
        ) : (
          <div className="text-green-600 font-bold flex items-center gap-2 text-xl">
            <CheckCircle size={24} /> Pelajaran Selesai!
          </div>
        )}
      </div>
    </div>
  );
}
