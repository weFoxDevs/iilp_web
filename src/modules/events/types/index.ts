export type EventMode = "Hybrid" | "Online" | "Onsite";

export type EventCategory =
  | "All"
  | "Conferences"
  | "Seminars"
  | "Workshops"
  | "Webinars"
  | "Policy Dialogues";

export interface EventVenue {
  name: string;
  type: "campus" | "online";
}

export interface EventItem {
  id: string;
  slug?: string;
  title: string;
  description: string;
  shortSummary?: string;
  month: string;
  day: string;
  fullDate: string;
  time: string;
  seats: string;
  mode: EventMode;
  category: Exclude<EventCategory, "All">;
  venues: EventVenue[];
  image: string;
  isPopular?: boolean;
  isRegistrationOpen?: boolean;
  seatsCapacity?: number;
  seatsReserved?: number;
  relatedEvents?: EventItem[];
}

export interface RegistrationFormData {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  organization: string;
  country: string;
}
