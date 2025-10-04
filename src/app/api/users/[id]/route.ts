import { Prisma } from "@generated/prisma";
import { NextResponse } from "next/server";

import { deleteUser, getUserById, updateUser } from "@/services/userService";
import { updateUserInputSchema, userIdSchema } from "@/validators/user";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function resolveUserId(context: RouteContext) {
  const { id } = await context.params;
  return userIdSchema.parse(id);
}

function handlePrismaError(error: unknown, defaultMessage: string) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email is already in use." },
        { status: 409 },
      );
    }
  }

  console.error(error);
  return NextResponse.json({ error: defaultMessage }, { status: 500 });
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    const id = await resolveUserId(context);

    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({ data: user });
  } catch (error) {
    return handlePrismaError(error, "Failed to fetch user.");
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const id = await resolveUserId(context);
    const json = await request.json();
    const parsed = updateUserInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const user = await updateUser(id, parsed.data);
    return NextResponse.json({ data: user });
  } catch (error) {
    return handlePrismaError(error, "Failed to update user.");
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const id = await resolveUserId(context);

    await deleteUser(id);

    return NextResponse.json({ data: { id } }, { status: 200 });
  } catch (error) {
    return handlePrismaError(error, "Failed to delete user.");
  }
}
