import { Pathnames } from "next-intl/navigation";

export const locales = ["en", "ar"] as const;

export const pathnames = {
  "/": "/",
  "/userview/Home": {
    en: "/userview/Home",
    ar: "/userview/Home",
  },
  "/auth/login": {
    en: "/login",
    ar: "/login",
  },
  "/auth/setNewPass": {
    en: "/setNewPass",
    ar: "/setNewPass",
  },
  '/auth/resetPass': {
    en: "/resetPass",
    ar: "/resetPass",
  },
  "/not-found": {
    en: "/not-found",
    ar: "/not-found",
  },
   "/auth/signUp": {
    en: "/signup",
    ar: "/signup",
  },
  "/error": {
    en: "/error",
    ar: "/error",
  },
} satisfies Pathnames<typeof locales>;

export const localePrefix = undefined;

export type AppPathnames = keyof typeof pathnames;
