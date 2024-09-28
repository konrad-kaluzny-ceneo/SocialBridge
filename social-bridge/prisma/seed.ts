import { $Enums, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const isAdminQuestionnaireCompleted = false;

  await prisma.organization.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.review.deleteMany();
  await prisma.partnership.deleteMany();
  await prisma.event.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  const someAddress1 = await prisma.address.create({
    data: {
      street: "Fabryczna 13",
      city: "Kraków",
      zipCode: "31-553",
      lat: 50.0659428,
      lng: 19.9703589,
    },
  });

  const someAddress2 = await prisma.address.create({
    data: {
      street: "Jana Kasprowicza 34-18",
      city: "Kraków",
      zipCode: "31-523",
      lat: 50.0682022,
      lng: 19.9669495,
    },
  });

  const someAddress3 = await prisma.address.create({
    data: {
      street: "Świętego Tomasza 32",
      city: "Kraków",
      zipCode: "31-014",
      lat: 50.0617316,
      lng: 19.9432673,
    },
  });

  const someAddress4 = await prisma.address.create({
    data: {
      street: "Grodzka 60-56",
      city: "Kraków",
      zipCode: "31-006",
      lat: 50.0553829,
      lng: 19.9375555,
    },
  });

  const someAddress5 = await prisma.address.create({
    data: {
      street: "Gazowa 9",
      city: "Kraków",
      zipCode: "31-060",
      lat: 50.0486614,
      lng: 19.9435355,
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_USER_EMAIL,
      name: process.env.SEED_ADMIN_USER_NAME,
      emailVerified: new Date(),
      username: null,
      image: process.env.SEED_ADMIN_USER_IMAGE,
      OrganizationType: $Enums.OrganizationType.NGO,
    },
  });

  const businessBigUser = await prisma.user.create({
    data: {
      email: "businessbig@prisma.io",
      name: "Business Big",
      emailVerified: new Date(),
      username: "businessbig",
      image: "https://i.pravatar.cc/150?img=7",
      OrganizationType: $Enums.OrganizationType.BUSINESS,
    },
  });

  const businessBigAddress = await prisma.address.create({
    data: {
      street: "Józefa 1",
      city: "Kraków",
      zipCode: "31-056",
      lat: 50.0501956,
      lng: 19.9429035,
    },
  });

  const businessBigOrganization = await prisma.organization.create({
    data: {
      name: "Business Big",
      description: "Business Big",
      goal: "Business Big",
      addressId: businessBigAddress.id,
      Users: {
        connect: {
          id: businessBigUser.id,
        },
      },
    },
  });

  const businessSmallUser = await prisma.user.create({
    data: {
      email: "businesssmall@prisma.io",
      name: "Business Small",
      emailVerified: new Date(),
      username: "businesssmall",
      image: "https://i.pravatar.cc/150?img=8",
      OrganizationType: $Enums.OrganizationType.BUSINESS,
    },
  });

  const businessSmallAddress = await prisma.address.create({
    data: {
      street: "Świętego Sebastiana 25",
      city: "Kraków",
      zipCode: "31-051",
      lat: 50.0547233,
      lng: 19.9399084,
    },
  });

  const businessSmallOrganization = await prisma.organization.create({
    data: {
      name: "Business Small",
      description: "Business Small",
      goal: "Business Small",
      addressId: businessSmallAddress.id,
      Users: {
        connect: {
          id: businessSmallUser.id,
        },
      },
    },
  });

  const ngoUser = await prisma.user.create({
    data: {
      email: "ngo@prisma.io",
      name: "NGO",
      emailVerified: new Date(),
      username: "ngo",
      image: "https://i.pravatar.cc/150?img=9",
      OrganizationType: $Enums.OrganizationType.NGO,
    },
  });

  const ngoAddress = await prisma.address.create({
    data: {
      street: "Józefa Sarego 13",
      city: "Kraków",
      zipCode: "33-332",
      lat: 50.0566475,
      lng: 19.937875,
    },
  });

  const ngoOrganization = await prisma.organization.create({
    data: {
      name: "NGO",
      description: "NGO",
      goal: "NGO",
      addressId: ngoAddress.id,
      Users: {
        connect: {
          id: ngoUser.id,
        },
      },
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
