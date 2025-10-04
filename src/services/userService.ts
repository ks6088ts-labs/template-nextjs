import type { Prisma, User } from "@generated/prisma";
import { prisma } from "@/lib/prisma";

export async function listUsers(): Promise<User[]> {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
  });
}

export async function getUserById(id: number): Promise<User | null> {
  return prisma.user.findUnique({ where: { id } });
}

export async function createUser(
  payload: Prisma.UserCreateInput,
): Promise<User> {
  return prisma.user.create({ data: payload });
}

export async function updateUser(
  id: number,
  payload: Prisma.UserUpdateInput,
): Promise<User> {
  return prisma.user.update({
    where: { id },
    data: payload,
  });
}

export async function deleteUser(id: number): Promise<User> {
  return prisma.user.delete({ where: { id } });
}
