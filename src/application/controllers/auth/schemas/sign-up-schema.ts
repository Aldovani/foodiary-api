import { Profile } from '@application/entities/profile';
import z from 'zod';

export const signUpSchema = z.object({
  account: z.object({
    email: z.email('"email" is required and must be a valid email address'),
    password: z.string().min(8, '"password" must be at least 8 characters long'),
  }),
  profile: z.object({
    Name: z.string().min(1, '"Name" is required'),
    birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: '"birthDate" must be a valid date string',
    }).transform((date) => new Date(date)),
    gender: z.enum(Profile.Gender),
    height: z.number().positive('"height" must be a positive number'),
    weight: z.number().positive('"weight" must be a positive number'),
    goal: z.enum(Profile.Goal),
    activityLevel: z.enum(['sedentary', 'light', 'moderate', 'active', 'very_active'], {
      error: () => ({ message: '"activityLevel" is required and must be one of: "sedentary", "light", "moderate", "active", or "very_active"' }),
    }),
  }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
