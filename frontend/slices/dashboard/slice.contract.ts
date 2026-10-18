import { Doc } from "../../../convex/_generated/dataModel";

export interface DashboardContract {
  user: Doc<"users">;
  courses: Array<any>;
}
