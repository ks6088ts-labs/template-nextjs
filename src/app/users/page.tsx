import { UserCreateForm } from "@/components/users/UserCreateForm";
import { UserTable } from "@/components/users/UserTable";
import { listUsers } from "@/services/userService";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await listUsers();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 p-6 sm:p-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-slate-900">ユーザー管理</h1>
        <p className="text-sm text-slate-600">
          Prisma に定義された User
          モデルを操作するための管理画面です。新規登録、編集、削除がブラウザから行えます。
        </p>
      </header>
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          ユーザーを追加
        </h2>
        <UserCreateForm />
      </section>
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            登録ユーザー一覧
          </h2>
        </div>
        <UserTable users={users} />
      </section>
    </div>
  );
}
