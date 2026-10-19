import type { ReactNode } from "react";
import type { Site } from "@pandino/schema";
import type { Action } from "./fields";

export type Block = {
  site: Site;
  section: Site["pages"][number]["sections"][number];
};

const PLACEHOLDER_PHONE = /^\+(?:390+|10+)$/;

export function readFields<T>(schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } }, fields: unknown) {
  const parsed = schema.safeParse(fields);
  return parsed.success ? parsed.data : null;
}

export function tx(site: Site, value: Record<string, string>) {
  return value[site.locales.default] ?? "";
}

export function actionHref(action: Action) {
  if (action.type === "open_form") return `#${action.formId ?? "quote"}`;
  if (action.type === "url") return action.value ?? "#";
  if (action.value && PLACEHOLDER_PHONE.test(action.value)) return "#contact";
  if (action.type === "whatsapp") return `https://wa.me/${(action.value ?? "").replace(/\D/g, "")}`;
  if (action.type === "sms") return `sms:${action.value ?? ""}`;
  return `tel:${action.value ?? ""}`;
}

export function Cta({ site, label, action, className }: {
  site: Site;
  label: Record<string, string>;
  action: Action;
  className: string;
}) {
  return <a className={className} href={actionHref(action)}>{tx(site, label)}</a>;
}

export function Frame({ label }: { label: string }) {
  return (
    <div className="frame" role="img" aria-label={label}>
      <span>{label}</span>
    </div>
  );
}

export function Heading({ title, body }: { title: string; body?: string }) {
  return (
    <div className="heading">
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

export function Band({ id, className, wrap, title, body, children }: {
  id: string;
  className: string;
  wrap: string;
  title?: string;
  body?: string;
  children: ReactNode;
}) {
  return (
    <section className={className} id={id}>
      <div className={wrap}>
        {title ? <Heading title={title} body={body} /> : null}
        {children}
      </div>
    </section>
  );
}
