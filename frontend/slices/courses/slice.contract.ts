import { Id } from "../../../convex/_generated/dataModel";

export interface CourseContract {
  id: Id<"courses">;
  title: string;
  description: string;
  teacherId: Id<"users">;
}

export interface LessonContract {
  id: Id<"lessons">;
  title: string;
  content: string;
  order: number;
}
