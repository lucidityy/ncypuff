export const BRAND = {
  shortName: "PuffNcy",
  fullName: "PuffNcy",
  tagline: "Ton cloud, ton style.",
  since: "Est. 2024",
  logo: "/brand/logo.png",
  banner: "/brand/banner.png",
  sticker: "/brand/sticker.png"
} as const;

export const CONTACT_LINKS = {
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_URL ?? "https://wa.me/",
  signal: process.env.NEXT_PUBLIC_SIGNAL_URL ?? "https://signal.me/",
  snapchat: process.env.NEXT_PUBLIC_SNAPCHAT_URL ?? "https://www.snapchat.com/add/"
} as const;

export const DELIVERY_LABEL = process.env.NEXT_PUBLIC_DELIVERY_LABEL ?? "Livraison" as const;
