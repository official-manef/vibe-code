import { query } from "../../_generated/server";
import { v } from "convex/values";
import { currentUser, publicUser } from "../../_shared/auth";
import { user } from "../../_shared/validators";

export const me = query({
  args: {},
  returns: v.union(user, v.null()),
  handler: async (ctx) => {
    const authenticated = await currentUser(ctx);
    return authenticated ? publicUser(authenticated) : null;
  },
});
