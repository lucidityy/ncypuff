export type ContactMethod = "whatsapp" | "signal" | "snapchat";

export interface CheckoutFormValues {
  address: string;
  note?: string;
  preferredContactMethod: ContactMethod;
}
