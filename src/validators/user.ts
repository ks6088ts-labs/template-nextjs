import { z } from "zod";

export const userIdSchema = z.coerce.number().int().positive();

const nameField = z
  .string({ message: "名前は文字列で指定してください。" })
  .trim()
  .max(255, "名前は255文字以内で入力してください。")
  .transform((value: string) => (value.length === 0 ? null : value))
  .optional();

export const createUserInputSchema = z.object({
  email: z
    .string({
      message: "メールアドレスは文字列で指定してください。",
    })
    .trim()
    .min(1, "メールアドレスは必須です。")
    .max(320, "メールアドレスは320文字以内で入力してください。")
    .email("有効なメールアドレス形式で入力してください。"),
  name: nameField,
});

export const updateUserInputSchema = z.object({
  email: createUserInputSchema.shape.email,
  name: nameField,
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;
export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;
