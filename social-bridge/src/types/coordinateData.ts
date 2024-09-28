import { EventType, OrganizationType, PartnershipTag } from "@prisma/client";

export interface CoordinateData {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
}

export interface OrganizationCoordinateData extends CoordinateData {
  organizationType: OrganizationType;
  searchPartnershipTags: PartnershipTag[];
  givePartnershipTags: PartnershipTag[];
}

export interface EventCoordinateData extends CoordinateData {
  eventType: EventType;
}
