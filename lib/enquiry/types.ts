import { z } from "zod";

export const ContactEnquirySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  email: z.string().email("Invalid email address").max(100),
  phone: z.string().min(1, "Phone is required").max(50),
  interest: z.string().max(100),
  rooms: z.string().max(100).optional(),
  needCatering: z.boolean().optional(),
  message: z.string().max(2000).optional(),
}).strict();

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
}).strict();

export const PlanEventSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  phone: z.string().min(1, "Phone is required").max(50),
  email: z.string().email("Invalid email address").max(100),
  eventType: z.string().max(100),
  eventDate: z.string().max(100),
  guestCount: z.string().max(100),
  rooms: z.string().max(100),
}).strict();

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
}).strict();

export const UnderTheSkyEnquirySchema = z.object({
  planningType: z.string().min(1).max(100),
  planningOtherText: z.string().max(200).optional(),
  occasionDetails: z.string().max(2000).optional(),
  preferredDate: z.string().min(1).max(100),
  expectedGuests: z.string().min(1).max(100),
  settingPreferences: z.array(z.string().max(100)).min(1).max(20),
  name: z.string().min(1, "Name is required").max(100),
  phoneNumber: z.string().min(1, "Phone is required").max(50),
  emailAddress: z.union([z.string().email("Invalid email address").max(100), z.literal("")]).optional(),
}).strict();

export const EnquiryPayloadSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("contact"), data: ContactEnquirySchema }).strict(),
  z.object({ type: z.literal("dining"), data: DiningEnquirySchema }).strict(),
  z.object({ type: z.literal("plan_event"), data: PlanEventSchema }).strict(),
  z.object({ type: z.literal("offsite"), data: OffsiteEnquirySchema }).strict(),
  z.object({ type: z.literal("under_the_sky"), data: UnderTheSkyEnquirySchema }).strict(),
]);

export type EnquiryPayload = z.infer<typeof EnquiryPayloadSchema>;

export type EnquiryResult = {
  success: boolean;
  message: string;
  isDemo?: boolean;
  errors?: Record<string, string[]>;
};
