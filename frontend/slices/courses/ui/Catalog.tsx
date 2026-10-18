"use client";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Catalog() {
  const courses = useQuery(api.features.courses.queries.list);

  if (courses === undefined) return <div className="p-8 text-center">Loading courses...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-8">
      {courses.map((course) => (
        <div key={course._id} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition bg-white p-6">
          <div className="flex items-center gap-2 text-blue-600 text-sm font-medium mb-3">
            <BookOpen size={16} /> Vibe Course
          </div>
          <h2 className="text-2xl font-bold mb-3">{course.title}</h2>
          <p className="text-gray-600 mb-6 line-clamp-3">{course.description}</p>
          <Button className="w-full rounded-xl font-semibold" asChild>
            <Link href={`/courses/${course._id}`}>Lihat Detail</Link>
          </Button>
        </div>
      ))}
    </div>
  );
}
