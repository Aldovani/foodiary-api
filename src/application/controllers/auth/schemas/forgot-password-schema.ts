import z from 'zod';

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, '"email" is required'),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
