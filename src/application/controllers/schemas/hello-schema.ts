import z from "zod";

export const helloSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
});

export type HelloSchema = z.infer<typeof helloSchema>;
