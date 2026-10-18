"use client";
import { useQuery } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { CreateCourseForm } from "./CreateCourseForm";

export function TeacherDashboard() {
  const data = useQuery(api.features.dashboard.queries.getTeacherDashboard);
  const [showCreate, setShowCreate] = useState(false);

  if (data === undefined) return <div className="p-20 text-center">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">Dashboard Guru</h1>
        {!showCreate && (
          <Button onClick={() => setShowCreate(true)} className="rounded-xl px-6 py-2.5 font-semibold">
            <PlusCircle className="mr-2" /> Buat Kursus
          </Button>
        )}
      </div>

      {showCreate && (
        <CreateCourseForm onComplete={() => setShowCreate(false)} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.courses.map((course) => (
          <div key={course._id} className="border rounded-2xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-6 line-clamp-2">{course.description}</p>
            <Button variant="outline" className="w-full rounded-xl py-2.5 font-medium" asChild>
              <Link href={`/courses/${course._id}`}>Kelola Kursus</Link>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
