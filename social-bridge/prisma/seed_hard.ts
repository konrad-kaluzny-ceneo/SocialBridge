import { $Enums, PartnershipTag, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const isAdminOrganizationCreated = true;

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

  const adminAddress = await prisma.address.create({
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
      isApprovedMember: true,
    },
  });

  if (isAdminOrganizationCreated) {
    const adminOrganization = await prisma.organization.create({
      data: {
        name: "Fundacja Admini Razem",
        shortDescription:
          "Wspieramy adminów i devopsów z całego świata by żyło im się lepiej.",
        longDescription:
          "Fundacja Admini Razem została założona w 2020 roku z misją wspierania administratorów systemów i specjalistów DevOps na całym świecie. Nasze działania koncentrują się na organizacji szkoleń, warsztatów, mentoringu oraz tworzeniu narzędzi open-source dla społeczności IT.",
        sociamImpactStrategy:
          "Fundacja Admini Razem aktywnie promuje zrównoważone praktyki w infrastrukturze IT, dążąc do redukcji śladu węglowego centrów danych i optymalizacji zużycia energii.",
        socialGoals:
          "Naszym celem jest poprawa warunków pracy adminów i DevOps, promowanie work-life balance oraz zwiększanie świadomości na temat znaczenia ich pracy w nowoczesnym świecie technologii.",
        previousExperience:
          "Od 2020 roku Fundacja Admini Razem zorganizowała ponad 30 warsztatów online, stworzyła 5 popularnych narzędzi open-source i pomogła ponad 1000 specjalistom IT w rozwoju kariery. Nasze programy mentoringowe zwiększyły satysfakcję z pracy uczestników o 40% i przyczyniły się do 25% wzrostu wynagrodzeń w ciągu roku od ukończenia programu.",
        projectsToRealize:
          "Planujemy uruchomić globalną platformę e-learningową dedykowaną zaawansowanym technologiom DevOps i zarządzaniu chmurą. Dodatkowo, pracujemy nad stworzeniem programu certyfikacji dla etycznych hakerów specjalizujących się w bezpieczeństwie infrastruktury. Zamierzamy również zorganizować pierwszą międzynarodową konferencję poświęconą well-being w branży IT.",
        searchPartnershipTags: [
          PartnershipTag.FUNDATOR,
          PartnershipTag.DOSTARCZYCIEL_MATERIALU,
        ],
        givePartnershipTags: [PartnershipTag.IT, PartnershipTag.ORGANIZATOR],
        addressId: adminAddress.id,
        OrganizationType: $Enums.OrganizationType.NGO,
        Team: {
          connect: {
            id: adminUser.id,
          },
        },
      },
    });

    const volunteer3 = await prisma.user.create({
      data: {
        email: "volunteer3@prisma.io",
        name: "Volunteer 3",
        emailVerified: new Date(),
        username: "volunteer3",
        image: "https://i.pravatar.cc/150?img=12",
        volunteerRole: "Mentor",
        volunteerStrengths: "Programowanie, matematyka, fizyka",
        organizationId: adminOrganization.id,
        isApprovedMember: false,
      },
    });

    const volunteer4 = await prisma.user.create({
      data: {
        email: "volunteer4@prisma.io",
        name: "Volunteer 4",
        emailVerified: new Date(),
        username: "volunteer4",
        image: "https://i.pravatar.cc/150?img=13",
        volunteerRole: "Mentor",
        volunteerStrengths: "Programowanie, matematyka, fizyka",
        organizationId: adminOrganization.id,
        isApprovedMember: true,
      },
    });
  }

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
      lat: 50.0501956,
      lng: 19.9429035,
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
      givePartnershipTags: [PartnershipTag.IT, PartnershipTag.FUNDATOR],
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
      lat: 50.0547233,
      lng: 19.9399084,
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
        PartnershipTag.FUNDATOR,
        PartnershipTag.DOSTARCZYCIEL_MATERIALU,
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
      lat: 50.0566475,
      lng: 19.937875,
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
        PartnershipTag.FUNDATOR,
        PartnershipTag.DOSTARCZYCIEL_MATERIALU,
      ],
      givePartnershipTags: [PartnershipTag.IT, PartnershipTag.FUNDATOR],
      addressId: ngoAddress.id,
      OrganizationType: $Enums.OrganizationType.NGO,
      Team: {
        connect: {
          id: ngoUser.id,
        },
      },
    },
  });

  // Partnerships
  const partnership = await prisma.partnership.create({
    data: {
      organizerId: businessBigOrganization.id,
      partnerId: ngoOrganization.id,
      givePartnershipTags: [PartnershipTag.IT, PartnershipTag.FUNDATOR],
      searchPartnershipTags: [PartnershipTag.ORGANIZATOR],
    },
  });

  // Events
  const event = await prisma.event.create({
    data: {
      title: "Warsztaty programowania dla młodzieży",
      description:
        "Warsztaty programowania dla młodzieży z obszarów wiejskich.",
      startEvent: new Date(),
      eventType: $Enums.EventType.GROUP_WORKSHOP,
      eventStatus: $Enums.EventStatus.ACTIVE,
      budget: 10000,
      addressId: someAddress1.id,
      eventOrganizerId: businessBigOrganization.id,
    },
  });

  await prisma.event.findUnique({
    where: {
      id: event.id,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      title: "Warsztaty programowania dla młodzieży",
      description:
        "Warsztaty programowania dla młodzieży z obszarów wiejskich.",
      startEvent: new Date(),
      eventType: $Enums.EventType.GROUP_WORKSHOP,
      eventStatus: $Enums.EventStatus.ACTIVE,
      budget: 10000,
      addressId: someAddress1.id,
      eventOrganizerId: businessBigOrganization.id,
    },
  });

  const businessLogo1 = await prisma.photo.create({
    data: {
      url: "/images/business-meeting1.jpg",
      key: "meeting1",
      fileName: "meeting1.jpg",
    },
  });

  const businessLogo2 = await prisma.photo.create({
    data: {
      url: "/images/it-workship2.jpg",
      key: "it-workship2",
      fileName: "it-workship2.jpg",
    },
  });

  const businessLogo3 = await prisma.photo.create({
    data: {
      url: "/images/hands3.jpg",
      key: "logo3",
      fileName: "logo3.jpg",
    },
  });

  await prisma.organization.update({
    where: {
      id: businessBigOrganization.id,
    },
    data: {
      Photos: {
        connect: [businessLogo1],
      },
    },
  });

  await prisma.organization.update({
    where: {
      id: businessSmallOrganization.id,
    },
    data: {
      Photos: {
        connect: [businessLogo2],
      },
    },
  });

  await prisma.organization.update({
    where: {
      id: ngoOrganization.id,
    },
    data: {
      Photos: {
        connect: [businessLogo3],
      },
    },
  });

  const eventPhoto = await prisma.photo.create({
    data: {
      url: "/images/it-workship2.jpg",
      key: "it-workship2",
      fileName: "it-workship2.jpg",
    },
  });

  await prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      Photos: {
        connect: [eventPhoto],
      },
    },
  });

  const eventPhoto2 = await prisma.photo.create({
    data: {
      url: "/images/it-workship2.jpg",
      key: "it-workship2",
      fileName: "it-workship2.jpg",
    },
  });

  await prisma.event.update({
    where: {
      id: event2.id,
    },
    data: {
      Photos: {
        connect: [eventPhoto2],
      },
    },
  });

  // Volunteers of NGO
  const volunteer1 = await prisma.user.create({
    data: {
      email: "volunteer1@prisma.io",
      name: "Volunteer 1",
      emailVerified: new Date(),
      username: "volunteer1",
      image: "https://i.pravatar.cc/150?img=10",
      volunteerRole: "Mentor",
      volunteerStrengths: "Programowanie, matematyka, fizyka",
      organizationId: ngoOrganization.id,
      isApprovedMember: true,
    },
  });

  const volunteer2 = await prisma.user.create({
    data: {
      email: "volunteer2@prisma.io",
      name: "Volunteer 2",
      emailVerified: new Date(),
      username: "volunteer2",
      image: "https://i.pravatar.cc/150?img=11",
      volunteerRole: "Mentor",
      volunteerStrengths: "Programowanie, matematyka, fizyka",
      organizationId: ngoOrganization.id,
      isApprovedMember: true,
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
