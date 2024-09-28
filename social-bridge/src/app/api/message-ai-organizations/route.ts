import { currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { OrganizationCoordinateData } from "@/types/coordinateData";

import { db } from "@/db";
import { openai } from "@/lib/openai";
import { SendAiMessageValidator } from "@/validators/ai";

export const POST = async (req: NextRequest) => {
  const body = await req.json();

  const user = await currentUser();
  if (!user) return new Response("Błąd autoryzacji", { status: 401 });

  const { id: userId } = user;

  const { chatId, message } = SendAiMessageValidator.parse(body);

  const chat = await db.chatWithAi.findFirst({ where: { id: chatId, userId } });
  if (!chat) return new Response("Nie znaleziono czatu", { status: 404 });

  await db.messageWithAi.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      chatId,
    },
  });

  const possibleOrganizations = await db.organization.findMany({
    include: {
      Address: true,
    },
    where: {
      Team: {
        none: {
          id: userId,
        },
      },
    },
  });

  const prevMessages = await db.messageWithAi.findMany({
    where: { chatId },
    orderBy: { createdAt: "asc" },
    take: 6,
  });

  const formattedPrevMessages = prevMessages.map((message) => ({
    role: message.isUserMessage ? ("user" as const) : ("assistant" as const),
    content: message.text,
  }));

  const userOrganization = await db.organization.findFirst({
    where: {
      Team: {
        some: {
          id: userId,
        },
      },
    },
  });

  let userOrganizationDataString = "";
  if (userOrganization) {
    userOrganizationDataString = `User organization: ${userOrganization.name}, ${userOrganization.shortDescription}`;
    userOrganizationDataString += `Social goals: ${userOrganization.socialGoals}`;
    userOrganizationDataString += `Sociam impact strategy: ${userOrganization.sociamImpactStrategy}`;
    userOrganizationDataString += `Business goals: ${userOrganization.businessGoals}`;
    userOrganizationDataString += `Previous experience: ${userOrganization.previousExperience}`;
    userOrganizationDataString += `Projects to realize: ${userOrganization.projectsToRealize}`;
    userOrganizationDataString += `Search partnership tags: ${userOrganization.searchPartnershipTags}`;
    userOrganizationDataString += `Give partnership tags: ${userOrganization.givePartnershipTags}`;
  }

  const possibleCoordinates: OrganizationCoordinateData[] =
    possibleOrganizations
      .filter(
        (organization) =>
          organization.Address != null &&
          organization.Address.lat != null &&
          organization.Address.lng != null &&
          organization.OrganizationType != null,
      )
      .map((organization) => ({
        id: organization.id,
        coordinates: [
          -(-organization.Address!.lat!),
          -(-organization.Address!.lng!),
        ],
        title: organization.name,
        organizationType: organization.OrganizationType!,
        description: organization.shortDescription,
        searchPartnershipTags: organization.searchPartnershipTags,
        givePartnershipTags: organization.givePartnershipTags,
      }));

  const coordinateDataString = possibleCoordinates
    .map((data) => {
      let dataString = `Id: ${data.id}, `;
      dataString += `Coordinates: ${data.coordinates}, `;
      dataString += `Title: ${data.title}, `;
      dataString += `Organization Type: ${data.organizationType}, `;
      dataString += `Description: ${data.description}, `;
      dataString += `Search Partnership Tags: ${data.searchPartnershipTags}, `;
      dataString += `Give Partnership Tags: ${data.givePartnershipTags}`;
      return dataString;
    })
    .join("\n");

  const systemContent = `You are an assistant in a chatbot that helps users find organizations.\n
You have access to a database of organizations with their coordinates.\n
You can use two types of answers: markdown and JSON.\n
If you know the answer to the user's question, you should return it in JSON format.\n
If you need to provide context to the user, you should use markdown.\n
You can use the following markdown elements: headings, lists, links, and images.\n
You should always use real data from the database in your responses.\n
You can ask the user for more information if you need it. But dont ask, if you already have all the needed information.\n
Answer only in polish language.\n
In markdowns use only organization titles, not coordinates.\n

\n\n

EXAMPLE OF USER QUESTION:
  Szukam organizacji, która pomoże mi w organizacji szkolenia IT dla niepełnosprawnych.

\n\n


------ IF YOU NEED TO PROVIDE CONTEXT ------

EXAMPLE OF YOUR ANSWER STRUCTURE:
# Potrzebuję więcej informacji
  - Jakiego typu wydarzenie organizujesz?
  - Jaka jest Twoja lokalizacja?
  - Jaka jest preferowana data?



------ IF YOU KNOW ANSWER OR WANT TO PROPOSE SOMETHING FROM DATABASE ------

EXAMPLE OF YOUR ANSWER STRUCTURE:
[
    {
    "id": number,
    "coordinates": [number, number],
    "confidence": number
    },
    {
    "id": number,
    "coordinates": [number, number],
    "confidence": number
    }
]


`;

  // console.log("\n||||\nSystem content\n|||||||\n", systemContent);

  const userContent = `
CONTEXT OF POSSIBLE ORGANIZATIONS:
${coordinateDataString}

\n-------\n

CONTEXT OF USER ORGANIZATION:
${userOrganizationDataString}

\n-------\n

PREVIOUS CONVERSATION:\n
 ${formattedPrevMessages
   .map((message) => {
     return `${message.role === "user" ? "User" : "Assistant (You)"}: ${message.content}\n\n`;
   })
   .join("")}

\n\n

NEW USER INPUT (ANWSER TO IT): ${message}`;

  // console.log("\n|||||||\nUser input\n|||||||\n", userContent);

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.5,
    stream: true,
    messages: [
      {
        role: "system",
        content: systemContent,
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  });

  const stream = OpenAIStream(response, {
    async onCompletion(completion) {
      const isCoordinatesData = completion.startsWith("[");

      // console.log("Completion", completion);

      await db.messageWithAi.create({
        data: {
          text: completion,
          isUserMessage: false,
          isCoordinatesData,
          chatId,
          userId,
        },
      });
    },
  });

  return new StreamingTextResponse(stream);
};
