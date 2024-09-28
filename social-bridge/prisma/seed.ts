import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.deleteMany();

  const adminUser = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_USER_EMAIL,
      name: process.env.SEED_ADMIN_USER_NAME,
      emailVerified: new Date(),
      username: null,
      image: process.env.SEED_ADMIN_USER_IMAGE,
    },
  });

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
