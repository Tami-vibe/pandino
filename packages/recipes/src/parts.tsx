import type { ReactNode } from "react";
import type { Site } from "@pandino/schema";
import type { Action } from "./fields";
import { actionHref } from "./href";
import { Mark, toneOf } from "./media";

export type Block = {
  site: Site;
  section: Site["pages"][number]["sections"][number];
};

export function readFields<T>(schema: { safeParse: (value: unknown) => { success: true; data: T } | { success: false } }, fields: unknown) {
  const parsed = schema.safeParse(fields);
  return parsed.success ? parsed.data : null;
}

export function tx(site: Site, value: Record<string, string>) {
  return value[site.locales.default] ?? "";
}

export { actionHref, pageHref } from "./href";

export function liveAction(site: Site, action: Action): Action {
  if (action.type === "whatsapp") return { ...action, value: site.business.whatsapp || site.business.phone };
  if (action.type === "tel" || action.type === "sms") return { ...action, value: site.business.phone };
  return action;
}

export function Cta({ site, label, action, className, icon }: {
  site: Site;
  label: Record<string, string>;
  action: Action;
  className: string;
  icon?: string;
}) {
  return <a className={className} href={actionHref(liveAction(site, action), site)}>{icon ? <Mark name={icon} /> : null}{tx(site, label)}</a>;
}

export function Heading({ title, body, icon }: { title: string; body?: string; icon?: string }) {
  return (
    <div className="heading">
      {icon ? <Mark name={icon} /> : null}
      <h2>{title}</h2>
      {body ? <p>{body}</p> : null}
    </div>
  );
}

export function Band({ id, group, label, className, wrap, title, body, icon, style, image, variant = "", children }: {
  id: string;
  group: string;
  label: string;
  className: string;
  wrap: string;
  title?: string;
  body?: string;
  icon?: string;
  style?: { background: string; overlay: number };
  image?: string;
  variant?: string;
  children: ReactNode;
}) {
  const tone = toneOf(style, image);
  return (
    <section className={`${className} tone-${tone.mode} reveal`} id={id} data-group={group} data-label={label} data-icon={icon} data-variant={variant} style={tone.css}>
      {tone.mode === "image" ? <span className="veil" aria-hidden="true" /> : null}
      <div className={wrap}>
        {title ? <Heading title={title} body={body} icon={icon} /> : null}
        {children}
      </div>
    </section>
  );
}
