import type { Doc } from "../../../convex/_generated/dataModel";

export interface DashboardContract {
  user: Omit<Doc<"users">, "tokenIdentifier">;
  courses: Array<Doc<"courses"> & { totalLessons?: number; completedLessons?: number }>;
}
