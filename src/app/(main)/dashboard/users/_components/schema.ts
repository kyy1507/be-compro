import z from "zod";

export const recentLeadSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role_name: z.string(),
  profile_picture_url: z.string().url().optional(),
});
