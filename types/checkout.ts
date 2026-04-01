export type ContactMethod = "whatsapp" | "signal" | "snapchat";

export interface CheckoutFormValues {
  firstName: string;
  phone: string;
  address: string;
  note?: string;
  preferredContactMethod: ContactMethod;
}
