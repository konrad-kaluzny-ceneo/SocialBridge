import { z } from "zod";

export const GetUserValidator = z.object({
  userId: z.string(),
});

export type GetUserRequest = z.infer<typeof GetUserValidator>;

export const UpdateVolunteerProfileValidator = z.object({
  userId: z.string(),
  volunteerExperience: z.string().optional(),
  volunteerSkills: z.string().optional(),
  volunteerProjects: z.string().optional(),
  volunteerRole: z.string().optional(),
  volunteerStrengths: z.string().optional(),
});

export type UpdateVolunteerProfileRequest = z.infer<
  typeof UpdateVolunteerProfileValidator
>;

