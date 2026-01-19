import { mbToBytes } from '@shared/utils/mb-to-bytes';
import z from 'zod';

export const CreateMealSchema = z.object({
  file: z.object({
    type: z.enum(['audio/mpeg', 'image/jpeg']),
    size: z
      .number()
      .min(1, 'The file.size should be at least 1 byte')
      .max(mbToBytes(10), 'The file.size should be at most 10 MB'),
  }),
});

export type CreateMealSchema = z.infer<typeof CreateMealSchema>;
