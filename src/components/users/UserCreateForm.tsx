"use client";

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";

import { createUserAction, type UserActionState } from "@/app/users/actions";
import { Button } from "@/components/ui/Button";
import { FormMessage } from "@/components/ui/FormMessage";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "追加中..." : "ユーザーを追加"}
    </Button>
  );
}

type FieldErrors = UserActionState["fieldErrors"];

function getFirstError(errors: FieldErrors, field: string): string | undefined {
  return errors?.[field]?.[0];
}

const initialUserActionState: UserActionState = {
  status: "idle",
};

export function UserCreateForm() {
  const [state, formAction] = useActionState(
    createUserAction,
    initialUserActionState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="space-y-1">
        <Label htmlFor="email">メールアドレス</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="user@example.com"
          required
          autoComplete="email"
        />
        <FormMessage
          message={getFirstError(state.fieldErrors, "email") ?? state.message}
        />
      </div>
      <div className="space-y-1">
        <Label htmlFor="name">名前 (任意)</Label>
        <Input
          id="name"
          name="name"
          placeholder="山田 太郎"
          autoComplete="name"
        />
        <FormMessage
          message={getFirstError(state.fieldErrors, "name") ?? undefined}
        />
      </div>
      {state.status === "success" ? (
        <p className="text-sm text-green-600">ユーザーを追加しました。</p>
      ) : null}
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
