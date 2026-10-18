"use client";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/Button";

export function CreateCourseForm({ onComplete }: { onComplete: () => void }) {
  const createCourse = useMutation(api.features.courses.mutations.create);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createCourse({ title, description });
      setTitle("");
      setDescription("");
      onComplete();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-2xl mb-8 border border-gray-200">
      <h3 className="text-xl font-bold mb-4">Buat Kursus Baru</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Judul Kursus</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Deskripsi</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
            rows={3}
            required
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={loading} className="rounded-xl px-8">
            {loading ? "Menyimpan..." : "Simpan Kursus"}
          </Button>
          <Button variant="ghost" type="button" onClick={onComplete} className="rounded-xl">
            Batal
          </Button>
        </div>
      </div>
    </form>
  );
}
