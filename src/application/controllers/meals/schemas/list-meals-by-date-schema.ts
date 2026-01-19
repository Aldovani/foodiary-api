import z from 'zod';

export const ListMealByDateSchema = z.object({
  date:
    z.string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: '"Date" must be a valid date string',
      })
      .transform((date) => new Date(date)),
});
