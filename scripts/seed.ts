import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.createMany({
    data: [
      {
        name: "Alice",
        email: "alice@prisma.io",
      },
      {
        name: "Bob",
        email: "bob@prisma.io",
      },
      {
        name: "Charlie",
        email: "charlie@prisma.io",
      },
      {
        name: "David",
        email: "david@prisma.io",
      },
      {
        name: "Eve",
        email: "eve@prisma.io",
      },
    ],
  });
  console.log(user);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
