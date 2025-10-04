"use server";

import { Prisma } from "@generated/prisma";
import { revalidatePath } from "next/cache";

import { createUser, deleteUser, updateUser } from "@/services/userService";
import {
  createUserInputSchema,
  updateUserInputSchema,
  userIdSchema,
} from "@/validators/user";

export type UserActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string[]>;
};

function ensureString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}

function handlePrismaError(error: unknown): UserActionState {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        status: "error",
        fieldErrors: {
          email: ["指定したメールアドレスは既に使用されています。"],
        },
      };
    }
  }

  console.error(error);
  return {
    status: "error",
    message: "処理中にエラーが発生しました。",
  };
}

export async function createUserAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const submission = {
    email: ensureString(formData.get("email")),
    name: ensureString(formData.get("name")),
  };

  const parsed = createUserInputSchema.safeParse(submission);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return {
      status: "error",
      message: formErrors.at(0) ?? "入力内容を確認してください。",
      fieldErrors,
    };
  }

  try {
    await createUser(parsed.data);
    revalidatePath("/users");
    return {
      status: "success",
      message: "ユーザーを追加しました。",
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function updateUserAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const idResult = userIdSchema.safeParse(formData.get("id"));
  if (!idResult.success) {
    return {
      status: "error",
      message: "不正なユーザーIDです。",
    };
  }

  const submission = {
    email: ensureString(formData.get("email")),
    name: ensureString(formData.get("name")),
  };

  const parsed = updateUserInputSchema.safeParse(submission);
  if (!parsed.success) {
    const { fieldErrors, formErrors } = parsed.error.flatten();
    return {
      status: "error",
      message: formErrors.at(0) ?? "入力内容を確認してください。",
      fieldErrors,
    };
  }

  try {
    await updateUser(idResult.data, parsed.data);
    revalidatePath("/users");
    return {
      status: "success",
      message: "ユーザー情報を更新しました。",
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function deleteUserAction(
  _prevState: UserActionState,
  formData: FormData,
): Promise<UserActionState> {
  const idResult = userIdSchema.safeParse(formData.get("id"));
  if (!idResult.success) {
    return {
      status: "error",
      message: "不正なユーザーIDです。",
    };
  }

  try {
    await deleteUser(idResult.data);
    revalidatePath("/users");
    return {
      status: "success",
      message: "ユーザーを削除しました。",
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
