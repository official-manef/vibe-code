import { Doc } from "../../../convex/_generated/dataModel";

export interface DashboardCourse extends Doc<"courses"> {
  totalLessons: number;
  completedLessons: number;
}

export interface DashboardContract {
  user: Doc<"users">;
  courses: Array<DashboardCourse>;
}
