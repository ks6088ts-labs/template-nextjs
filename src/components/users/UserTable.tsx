"use client";

import type { User } from "@generated/prisma";
import { Fragment, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";

import {
  deleteUserAction,
  type UserActionState,
  updateUserAction,
} from "@/app/users/actions";
import { Button, type ButtonProps } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function SubmitButton({
  pendingLabel,
  label,
  variant = "primary",
}: {
  pendingLabel: string;
  label: string;
  variant?: ButtonProps["variant"];
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full sm:w-auto"
      variant={variant}
    >
      {pending ? pendingLabel : label}
    </Button>
  );
}

type FieldErrors = UserActionState["fieldErrors"];

function getFirstError(errors: FieldErrors, field: string): string | undefined {
  return errors?.[field]?.[0];
}

type UserTableProps = {
  users: User[];
};

function buildDisplayName(user: User): string {
  return user.name ?? "(未設定)";
}

const initialUserActionState: UserActionState = {
  status: "idle",
};

function EditRow({ user, onClose }: { user: User; onClose: () => void }) {
  const [state, formAction] = useFormState(
    updateUserAction,
    initialUserActionState,
  );

  useEffect(() => {
    if (state.status === "success") {
      onClose();
    }
  }, [state.status, onClose]);

  return (
    <tr className="border-t border-slate-200 bg-slate-50">
      <td colSpan={3} className="p-4">
        <form className="space-y-4" action={formAction}>
          <input type="hidden" name="id" value={user.id} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor={`email-${user.id}`}>メールアドレス</Label>
              <Input
                id={`email-${user.id}`}
                name="email"
                type="email"
                defaultValue={user.email}
                required
                autoComplete="email"
              />
              <FormMessage
                message={
                  getFirstError(state.fieldErrors, "email") ?? state.message
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={`name-${user.id}`}>名前 (任意)</Label>
              <Input
                id={`name-${user.id}`}
                name="name"
                defaultValue={user.name ?? ""}
                autoComplete="name"
              />
              <FormMessage
                message={getFirstError(state.fieldErrors, "name") ?? undefined}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button variant="secondary" type="button" onClick={onClose}>
              キャンセル
            </Button>
            <SubmitButton pendingLabel="更新中..." label="保存する" />
          </div>
        </form>
      </td>
    </tr>
  );
}

function DeleteUserForm({ userId }: { userId: number }) {
  const [state, formAction] = useFormState(
    deleteUserAction,
    initialUserActionState,
  );

  const showError = state.status === "error";
  const errorMessage = state.message ?? "削除に失敗しました。";

  return (
    <form className="inline" action={formAction}>
      <input type="hidden" name="id" value={userId} />
      <SubmitButton pendingLabel="削除中..." label="削除" variant="danger" />
      {showError ? (
        <FormMessage className="mt-2" message={errorMessage} />
      ) : null}
    </form>
  );
}

export function UserTable({ users }: UserTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  if (users.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
        登録済みのユーザーはいません。まずは「ユーザーを追加」フォームから作成してください。
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              ID
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
              メールアドレス / 名前
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
              操作
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {users.map((user) => (
            <Fragment key={user.id}>
              <tr className="hover:bg-slate-50">
                <td className="px-4 py-3 text-sm text-slate-600">{user.id}</td>
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-slate-900">
                    {user.email}
                  </div>
                  <div className="text-sm text-slate-500">
                    {buildDisplayName(user)}
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      onClick={() =>
                        setEditingId(editingId === user.id ? null : user.id)
                      }
                    >
                      {editingId === user.id ? "閉じる" : "編集"}
                    </Button>
                    <DeleteUserForm userId={user.id} />
                  </div>
                </td>
              </tr>
              {editingId === user.id ? (
                <EditRow user={user} onClose={() => setEditingId(null)} />
              ) : null}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
