import { Profile } from '@application/entities/profile';
import z from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(1, '"Name" is required'),
  birthDate: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: '"birthDate" must be a valid date string',
    })
    .transform((date) => new Date(date)),
  gender: z.enum(Profile.Gender),
  height: z.number().positive('"height" must be a positive number'),
  weight: z.number().positive('"weight" must be a positive number'),
});

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;
