import { $Enums, PartnershipTag, PrismaClient } from "@prisma/client";

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
    },
  });

  const someAddress2 = await prisma.address.create({
    data: {
      street: "Jana Kasprowicza 34-18",
      city: "Kraków",
      zipCode: "31-523",
    },
  });

  const someAddress3 = await prisma.address.create({
    data: {
      street: "Świętego Tomasza 32",
      city: "Kraków",
      zipCode: "31-014",
    },
  });

  const someAddress4 = await prisma.address.create({
    data: {
      street: "Grodzka 60-56",
      city: "Kraków",
      zipCode: "31-006",
    },
  });

  const someAddress5 = await prisma.address.create({
    data: {
      street: "Gazowa 9",
      city: "Kraków",
      zipCode: "31-060",
    },
  });

  const adminUser = await prisma.user.create({
    data: {
      email: process.env.SEED_ADMIN_USER_EMAIL,
      name: process.env.SEED_ADMIN_USER_NAME,
      emailVerified: new Date(),
      username: null,
      image: process.env.SEED_ADMIN_USER_IMAGE,
    },
  });

  const businessBigUser = await prisma.user.create({
    data: {
      email: "businessbig@prisma.io",
      name: "Business Big",
      emailVerified: new Date(),
      username: "businessbig",
      image: "https://i.pravatar.cc/150?img=7",
    },
  });

  const businessBigAddress = await prisma.address.create({
    data: {
      street: "Józefa 1",
      city: "Kraków",
      zipCode: "31-056",
    },
  });

  const businessBigOrganization = await prisma.organization.create({
    data: {
      name: "Globalex IT",
      shortDescription:
        "Softwarehouse dostarczający rozwiązania IT na całym globie.",
      longDescription:
        "Globalex IT to dynamiczna firma softwarehouse, która specjalizuje się w tworzeniu niestandardowych aplikacji internetowych i materiałów edukacyjnych. Nasza misja jest zwiększenie efektywności i produktywności naszych klientów poprzez zastosowanie nowoczesnych technologii i innowacyjnych rozwiązań.",
      sociamImpactStrategy:
        "Globalex IT jest członkiem stowarzyszenia Greenpeace, które promuje ochronę środowiska i zrównoważony rozwój.",
      socialGoals:
        "Naszym celem jest zwiększenie świadomości społeczeństwa o problemach związanych z ochroną środowiska i promowanie zrównoważonego rozwoju.",
      businessGoals:
        "Naszym celem jest stworzenie aplikacji mobilnych, które ułatwiają życie naszym klientom i pomagają im w osiągnięciu ich celów biznesowych.",
      previousExperience:
        "Globalex IT ma ponad 15 lat doświadczenia w tworzeniu oprogramowania dla międzynarodowych korporacji. Zrealizowaliśmy ponad 100 projektów dla klientów z różnych branż, w tym finanse, opieka zdrowotna i e-commerce. Nasze rozwiązania pomogły klientom zwiększyć wydajność operacyjną średnio o 40% i zredukować koszty IT o 25%.",
      projectsToRealize:
        "W najbliższej przyszłości planujemy rozwinąć naszą ofertę o rozwiązania z zakresu sztucznej inteligencji i uczenia maszynowego. Pracujemy nad platformą do automatyzacji procesów biznesowych wykorzystującą AI, która ma potencjał zrewolucjonizować sposób, w jaki firmy zarządzają swoimi operacjami. Dodatkowo, rozwijamy projekt blockchain dla sektora finansowego, mający na celu zwiększenie bezpieczeństwa i transparentności transakcji międzynarodowych.",
      searchPartnershipTags: [PartnershipTag.ORGANIZATOR],
      givePartnershipTags: [PartnershipTag.IT, PartnershipTag.CASH_PROVIDER],
      addressId: businessBigAddress.id,
      OrganizationType: $Enums.OrganizationType.BUSINESS,
      Team: {
        connect: {
          id: businessBigUser.id,
        },
      },
    },
  });

  await prisma.organization.findUnique({
    where: {
      id: businessBigOrganization.id,
    },
  });

  const businessSmallUser = await prisma.user.create({
    data: {
      email: "businesssmall@prisma.io",
      name: "Business Small",
      emailVerified: new Date(),
      username: "businesssmall",
      image: "https://i.pravatar.cc/150?img=8",
    },
  });

  const businessSmallAddress = await prisma.address.create({
    data: {
      street: "Świętego Sebastiana 25",
      city: "Kraków",
      zipCode: "31-051",
    },
  });

  const businessSmallOrganization = await prisma.organization.create({
    data: {
      name: "Startupex IT",
      shortDescription:
        "Startup specjalizujący się w tworzeniu aplikacji mobilnych.",
      longDescription:
        "Startupex IT to młoda firma, która specjalizuje się w tworzeniu aplikacji mobilnych dla małych i średnich przedsiębiorstw. Nasza misja polega na dostarczaniu naszym klientom innowacyjnych i efektywnych rozwiązań, które pomagają im w osiągnięciu sukcesu na rynku.",
      sociamImpactStrategy:
        "Startupex IT jest członkiem stowarzyszenia Greenpeace, które promuje ochronę środowiska i zrównoważony rozwój.",
      socialGoals:
        "Naszym celem jest zwiększenie świadomości społeczeństwa o problemach związanych z ochroną środowiska i promowanie zrównoważonego rozwoju.",
      businessGoals:
        "Naszym celem jest stworzenie aplikacji mobilnych, które ułatwiają życie naszym klientom i pomagają im w osiągnięciu ich celów biznesowych.",
      previousExperience:
        "Mimo że jesteśmy młodą firmą, nasz zespół ma bogate doświadczenie w tworzeniu aplikacji mobilnych. W ciągu ostatniego roku zrealizowaliśmy 5 projektów dla lokalnych firm, w tym aplikację do zarządzania zamówieniami dla restauracji oraz aplikację fitness z elementami grywalizacji. Nasze rozwiązania pomogły klientom zwiększyć efektywność operacyjną o 30% i zaangażowanie użytkowników o 45%.",
      projectsToRealize:
        "W najbliższej przyszłości planujemy stworzyć aplikację mobilną do zarządzania osobistymi finansami, wykorzystującą sztuczną inteligencję do analizy wydatków i sugerowania oszczędności. Dodatkowo, pracujemy nad koncepcją platformy e-learningowej dla małych i średnich przedsiębiorstw, która umożliwi im szkolenie pracowników w zakresie nowych technologii i umiejętności cyfrowych.",
      searchPartnershipTags: [PartnershipTag.ORGANIZATOR],
      givePartnershipTags: [
        PartnershipTag.IT,
        PartnershipTag.CASH_PROVIDER,
        PartnershipTag.MATERIAL_PROVIDER,
      ],
      addressId: businessSmallAddress.id,
      OrganizationType: $Enums.OrganizationType.BUSINESS,
      Team: {
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
    },
  });

  const ngoAddress = await prisma.address.create({
    data: {
      street: "Józefa Sarego 13",
      city: "Kraków",
      zipCode: "33-332",
    },
  });

  const ngoOrganization = await prisma.organization.create({
    data: {
      name: "Fundacja Równe Szanse",
      shortDescription:
        "Wspieramy edukację i rozwój młodzieży z obszarów wiejskich oraz studentów z niepełnosprawnościami.",
      longDescription:
        "Fundacja Równe Szanse została założona w 2015 roku z misją wyrównywania szans edukacyjnych dla młodzieży z obszarów wiejskich oraz wspierania studentów z niepełnosprawnościami. Nasze działania koncentrują się na organizacji szkoleń, warsztatów, mentoringu oraz pomocy materialnej dla naszych beneficjentów.",
      sociamImpactStrategy:
        "Fundacja Równe Szanse jest członkiem stowarzyszenia Greenpeace, które promuje ochronę środowiska i zrównoważony rozwój.",
      socialGoals:
        "Naszym celem jest zwiększenie świadomości społeczeństwa o problemach związanych z ochroną środowiska i promowanie zrównoważonego rozwoju.",
      previousExperience:
        "Od 2015 roku Fundacja Równe Szanse aktywnie działa na rzecz wyrównywania szans edukacyjnych. W ciągu ostatnich 8 lat zrealizowaliśmy ponad 50 projektów edukacyjnych, obejmując wsparciem ponad 5000 młodych ludzi z obszarów wiejskich i 500 studentów z niepełnosprawnościami. Nasze programy mentoringowe zwiększyły szanse na zatrudnienie uczestników o 60%, a 75% naszych beneficjentów kontynuowało edukację na poziomie wyższym.",
      projectsToRealize:
        "W najbliższej przyszłości planujemy uruchomić innowacyjny program online łączący młodzież z obszarów wiejskich z mentorami z czołowych firm technologicznych. Dodatkowo, pracujemy nad stworzeniem platformy e-learningowej dostosowanej do potrzeb osób z różnymi niepełnosprawnościami, która ma na celu zwiększenie dostępności edukacji cyfrowej. Planujemy również rozszerzyć nasz program stypendialny, aby objąć wsparciem finansowym większą liczbę utalentowanych studentów z trudnych środowisk.",
      searchPartnershipTags: [
        PartnershipTag.CASH_PROVIDER,
        PartnershipTag.MATERIAL_PROVIDER,
      ],
      givePartnershipTags: [PartnershipTag.IT, PartnershipTag.CASH_PROVIDER],
      addressId: ngoAddress.id,
      OrganizationType: $Enums.OrganizationType.NGO,
      Team: {
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
