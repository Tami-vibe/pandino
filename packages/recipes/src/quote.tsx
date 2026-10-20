import { recipeFields } from "./fields";
import { Mark, photo } from "./media";
import { readFields, tx, type Block } from "./parts";

export function Quote({ site, section }: Block) {
  const fields = readFields(recipeFields["convert.quote-booking"], section.fields);
  if (!fields) return null;
  const shot = section.variant === "split" ? photo(site, "ast_before") : undefined;
  return (
    <section id={section.id} data-group={section.group} data-label="Quote" data-icon="request_quote" className="w-full py-16 md:py-24 bg-base-100">
      <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="kit-split">
          {shot ? <figure className="shot-frame rounded-3xl border border-base-content/10 bg-base-200 m-0 min-h-[360px]"><img src={shot.src} alt={tx(site, shot.alt)} /><figcaption className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-base-100/70 backdrop-blur-md border border-white/10 text-xs">Sample dent photo. Not this shop.</figcaption></figure> : null}
          <div className="card bg-base-200/50 border border-base-content/10 p-6 sm:p-8 rounded-3xl">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-base-content">{tx(site, fields.headline)}</h2>
            <p className="text-sm text-base-content/70 mt-2">{tx(site, fields.subhead)}</p>
            <QuoteForm submit={tx(site, fields.submitLabel)} sms={site.business.market === "US"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function QuoteForm({ submit, sms }: { submit: string; sms: boolean }) {
  return (
    <form className="form space-y-4 mt-6">
      <fieldset className="job-pick">
        <legend><Mark name="request_quote" />What do you need?</legend>
        <label><input type="radio" name="job" value="dent" defaultChecked /> Dent / body only</label>
        <label><input type="radio" name="job" value="accident" /> Accident</label>
      </fieldset>
      <div className="for-dent">
        <fieldset className="job-pick">
          <legend>How bad is it?</legend>
          <label><input type="radio" name="severity" value="light" defaultChecked /> Light</label>
          <label><input type="radio" name="severity" value="medium" /> Medium</label>
          <label><input type="radio" name="severity" value="severe" /> Severe</label>
        </fieldset>
        <label className="text-xs font-medium text-base-content/80">Photos of the dent<input className="field file-input file-input-bordered w-full rounded-xl bg-base-100 text-sm" type="file" accept="image/*" multiple /></label>
        <p className="note text-xs text-base-content/60">Photos are usually enough for a body-only estimate.</p>
      </div>
      <div className="for-accident">
        <label className="text-xs font-medium text-base-content/80">Photos, if you have them<input className="field file-input file-input-bordered w-full rounded-xl bg-base-100 text-sm" type="file" accept="image/*" multiple /></label>
        <p className="note text-xs text-base-content/60">An accurate quote needs an in-person inspection; damage inside the car often doesn't show in photos.</p>
      </div>
      <label className="text-xs font-medium text-base-content/80">Name<input className="field input input-bordered w-full rounded-xl bg-base-100 text-sm" name="name" autoComplete="name" /></label>
      <label className="text-xs font-medium text-base-content/80">Phone<input className="field input input-bordered w-full rounded-xl bg-base-100 text-sm" name="phone" autoComplete="tel" /></label>
      <label className="check flex items-center gap-2 text-xs"><input type="checkbox" name="contact" /> I agree to be contacted about this quote.</label>
      {sms ? <label className="check flex items-center gap-2 text-xs"><input type="checkbox" name="sms" /> I agree to receive SMS about this request. Consent is not required to get an estimate. Message and data rates may apply. Reply STOP to cancel.</label> : null}
      <label className="check flex items-center gap-2 text-xs"><input type="checkbox" name="marketing" /> Marketing messages are optional and stay unticked.</label>
      <button className="btn btn-primary w-full h-12 rounded-full font-semibold text-sm" type="button">{submit}</button>
    </form>
  );
}
