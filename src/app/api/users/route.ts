import { Prisma } from "@generated/prisma";
import { NextResponse } from "next/server";

import { createUser, listUsers } from "@/services/userService";
import { createUserInputSchema } from "@/validators/user";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const users = await listUsers();
    return NextResponse.json({ data: users });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch users." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createUserInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid request payload.",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const user = await createUser(parsed.data);
    return NextResponse.json({ data: user }, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Email is already in use." },
          { status: 409 }
        );
      }
    }
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user." },
      { status: 500 }
    );
  }
}
