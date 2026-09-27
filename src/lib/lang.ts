import { cookies } from "next/headers";
import { LANG_COOKIE, type Lang } from "@/content/i18n";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return store.get(LANG_COOKIE)?.value === "sw" ? "sw" : "en";
}
