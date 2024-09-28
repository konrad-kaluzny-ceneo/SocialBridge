import { $Enums } from "@prisma/client";

export const getEventStatusName = (status: $Enums.EventStatus) => {
  switch (status) {
    case "PENDING":
      return "Oczekujące";
    case "ACTIVE":
      return "Aktywne";
    case "COMPLETED":
      return "Zakończone";
  }
};

export const getEventTypeName = (type: $Enums.EventType) => {
  switch (type) {
    case "GROUP_WORKSHOP":
      return "Warsztat grupowy";
    case "MENTORING":
      return "Mentoring";
    case "SCHOLARSHIP":
      return "Stypendium";
    case "SHELTERED_WORKSHOP":
      return "Praca chroniona";
    case "FUNDRAISER":
      return "Zbiórka";
  }
};
