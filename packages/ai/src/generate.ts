import { z } from "zod";
import { buildSite, chooseRecipes } from "./build";
import { dressSample } from "./sample";
import { chat } from "./model";
import { readProfile, type Market } from "./profile";

const fillSchema = z.object({
  recipes: z.array(z.string()).optional(),
  copy: z.record(z.string(), z.string()).optional(),
});

export async function generateSite(input: { prompt: string; brandColor: string; market?: "auto" | Market }) {
  const profile = readProfile(input.prompt, input.market ?? "auto");
  const model = await modelCopy(profile, input.prompt);
  return dressSample(buildSite(profile, input.brandColor, chooseRecipes(model.recipes), model.copy));
}

async function modelCopy(profile: { name: string; vertical: string; city: string; market: string }, prompt: string) {
  const key = process.env.AI_API_KEY;
  if (!key) return { recipes: null, copy: {} };
  const user = `Shop: ${profile.name}\nVertical: ${profile.vertical}\nCity: ${profile.city}\nMarket: ${profile.market}\nPrompt: ${prompt}`;
  let error = "";
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const parsed = fillSchema.safeParse(await chat(key, user, error));
      if (parsed.success) return { recipes: parsed.data.recipes ?? null, copy: parsed.data.copy ?? {} };
      error = parsed.error.issues.map((issue) => issue.message).join("; ").slice(0, 400);
    } catch (reason) {
      console.info(JSON.stringify({ pandino: "generation", fallback: true, reason: reason instanceof Error ? reason.message : "model failed" }));
      return { recipes: null, copy: {} };
    }
  }
  return { recipes: null, copy: {} };
}
