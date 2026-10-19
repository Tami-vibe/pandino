import promptText from "../prompt.json" with { type: "json" };

export function chatEndpoint(base = process.env.AI_BASE_URL || "https://api.openai.com/v1") {
  const url = new URL(base);
  if (url.protocol !== "https:") throw new Error("AI base URL must be https");
  if (url.username || url.password) throw new Error("AI base URL cannot include credentials");
  if (isPrivate(url.hostname)) throw new Error("AI base URL cannot be a private host");
  const path = url.pathname.replace(/\/$/, "");
  url.pathname = path.endsWith("/chat/completions") ? path : `${path}/chat/completions`;
  url.search = "";
  url.hash = "";
  return url;
}

function isPrivate(host: string) {
  const name = host.toLowerCase().replace(/^\[|\]$/g, "");
  if (name === "localhost" || name.endsWith(".localhost") || name.endsWith(".local") || name.endsWith(".internal")) return true;
  if (name === "::1" || name === "0.0.0.0") return true;
  const match = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/.exec(name);
  if (!match) return false;
  const a = Number(match[1]);
  const b = Number(match[2]);
  return a === 10 || a === 127 || a === 0 || (a === 192 && b === 168) || (a === 172 && b >= 16 && b <= 31) || (a === 169 && b === 254);
}

export async function chat(key: string, user: string, error: string) {
  const started = Date.now();
  const response = await fetch(chatEndpoint(), {
    method: "POST",
    redirect: "error",
    signal: AbortSignal.timeout(20_000),
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify({
      model: process.env.AI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: promptText.system },
        { role: "user", content: error ? `${user}\nFix: ${error}` : user },
      ],
    }),
  });
  if (!response.ok) throw new Error(`Model request failed (${response.status})`);
  const body = await response.json() as {
    usage?: { prompt_tokens?: number; completion_tokens?: number };
    choices?: { message?: { content?: string } }[];
  };
  const content = body.choices?.[0]?.message?.content ?? "";
  console.info(JSON.stringify({
    pandino: "generation",
    model: process.env.AI_MODEL || "gpt-4o-mini",
    durationMs: Date.now() - started,
    promptTokens: body.usage?.prompt_tokens ?? null,
    completionTokens: body.usage?.completion_tokens ?? null,
  }));
  return JSON.parse(content) as unknown;
}
