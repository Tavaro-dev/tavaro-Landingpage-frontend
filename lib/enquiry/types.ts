import { z } from "zod";

export const ContactEnquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(1, "Phone is required").max(50),
  interest: z.string().max(100),
  rooms: z.string().max(100).optional(),
  needCatering: z.boolean().optional(),
  message: z.string().max(2000).optional(),
});

export const EventEnquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(1, "Phone is required").max(50),
  eventType: z.string().max(100),
  eventDate: z.string().max(100),
  guestCount: z.number().int().min(1).max(10000),
  budget: z.string().max(100).optional(),
  venueKey: z.string().max(100).nullable(),
  withFood: z.boolean().nullable(),
  selectedItems: z.array(z.number().int()).max(100),
});

export const DiningEnquirySchema = z.object({
  planningType: z.string().max(100),
  requestType: z.string().max(100),
  name: z.string().min(1, "Name is required").max(100),
  contact: z.string().min(1, "Contact is required").max(100),
  eventDate: z.string().max(100),
  guestCount: z.string().max(100),
  occasion: z.string().max(100),
  diningStyle: z.string().max(100),
  gatheringDescription: z.string().max(2000),
});

export const PlanEventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(50),
  email: z.string().email("Invalid email address").max(100),
  eventType: z.string().max(100),
  eventDate: z.string().max(100),
  guestCount: z.string().max(100),
  rooms: z.string().max(100),
});

export const OffsiteEnquirySchema = z.object({
  planningType: z.string().max(100),
  afterHoursAddon: z.boolean(),
  purpose: z.array(z.string().max(100)).max(20),
  purposeOtherText: z.string().max(200).optional(),
  targetAudience: z.array(z.string().max(100)).max(20),
  audienceOtherText: z.string().max(200).optional(),
  expectedGuests: z.string().max(100),
  eventDuration: z.string().max(100),
  eventDate: z.string().max(100),
  creativeDirection: z.string().max(100),
  name: z.string().min(1, "Name is required").max(100),
  company: z.string().min(1, "Company is required").max(100),
  contactNumber: z.string().min(1, "Contact is required").max(50),
  email: z.string().email("Invalid email address").max(100),
  designation: z.string().min(1, "Designation is required").max(100),
});

export const EnquiryPayloadSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("contact"), data: ContactEnquirySchema }),
  z.object({ type: z.literal("event"), data: EventEnquirySchema }),
  z.object({ type: z.literal("dining"), data: DiningEnquirySchema }),
  z.object({ type: z.literal("plan_event"), data: PlanEventSchema }),
  z.object({ type: z.literal("offsite"), data: OffsiteEnquirySchema }),
]);

export type EnquiryPayload = z.infer<typeof EnquiryPayloadSchema>;

export type EnquiryResult = {
  success: boolean;
  message: string;
  isDemo?: boolean;
  errors?: Record<string, string[]>;
};
