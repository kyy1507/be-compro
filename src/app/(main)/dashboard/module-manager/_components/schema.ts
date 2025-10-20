import z from "zod";

export const recentLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
});
