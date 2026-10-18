"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function Detail({ courseId }: { courseId: any }) {
  const course = useQuery(api.features.courses.queries.getById, { id: courseId });
  const enroll = useMutation(api.features.courses.mutations.enroll);

  if (course === undefined) return <div className="p-20 text-center">Loading course...</div>;
  if (!course) return <div className="p-20 text-center">Course not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-10 rounded-3xl mb-12">
        <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
        <p className="text-blue-100 text-lg mb-8">{course.description}</p>
        <Button
          variant="secondary"
          className="bg-white text-blue-600 rounded-xl font-bold px-8"
          onClick={() => enroll({ courseId })}
        >
          Daftar Sekarang
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-6">Kurikulum</h2>
      <div className="space-y-4">
        {course.lessons.map((lesson, idx) => (
          <Link
            key={lesson._id}
            href={`/courses/${courseId}/lessons/${lesson._id}`}
            className="flex items-center gap-4 p-5 border rounded-2xl bg-white hover:bg-gray-50 transition"
          >
            <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
              {idx + 1}
            </div>
            <div className="flex-1 font-semibold">{lesson.title}</div>
            <Play size={18} className="text-gray-400" />
          </Link>
        ))}
      </div>
    </div>
  );
}
