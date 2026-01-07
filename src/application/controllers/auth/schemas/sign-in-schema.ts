import z from 'zod';

export const signInSchema = z.object({
  email: z.email('"email" is required and must be a valid email address'),
  password: z.string().min(8, '"password" must be at least 8 characters long'),
});

export type SignInSchema = z.infer<typeof signInSchema>;
