import z from 'zod';

export const updateGoalSchema = z.object({
  calorizes: z
    .number()
    .positive({ message: '"calories" must be a positive number' }),
  proteins: z
    .number()
    .positive({ message: '"proteins" must be a positive number' }),
  fats: z.number().positive({ message: '"fats" must be a positive number' }),
  carbohydrates: z
    .number()
    .positive({ message: '"carbohydrates" must be a positive number' }),
});

export type UpdateGoalSchema = z.infer<typeof updateGoalSchema>;
