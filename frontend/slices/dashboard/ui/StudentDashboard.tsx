"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { Trophy, BookOpen, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StudentDashboard() {
  const data = useQuery(api.features.dashboard.queries.getStudentDashboard);

  if (data === undefined) return <div className="p-20 text-center">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
          <Trophy size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Halo, {data.user.name}!</h1>
          <p className="text-gray-500">Terus tingkatkan skill Vibe Coding kamu.</p>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-6">Kursus Saya</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {data.courses.map((course: any) => {
          if (!course) return null;
          const percentage = course.totalLessons > 0
            ? Math.round((course.completedLessons / course.totalLessons) * 100)
            : 0;

          return (
            <div key={course._id} className="border rounded-2xl p-6 bg-white shadow-sm flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <BookOpen size={14} />
                    {course.completedLessons} / {course.totalLessons} Pelajaran Selesai
                  </p>
                </div>
                <div className="text-blue-600 font-bold">{percentage}%</div>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full mb-6 overflow-hidden">
                <div className="bg-blue-600 h-full transition-all" style={{ width: `${percentage}%` }} />
              </div>
              <Button variant="outline" className="mt-auto rounded-xl py-6 font-semibold" asChild>
                <Link href={`/courses/${course._id}`}>
                  Lanjutkan Belajar <ChevronRight className="ml-2" />
                </Link>
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
