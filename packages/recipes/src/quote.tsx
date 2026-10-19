import { recipeFields } from "./fields";
import { anyPhoto, Mark } from "./media";
import { Band, readFields, tx, type Block } from "./parts";

export function Quote({ site, section }: Block) {
  const fields = readFields(recipeFields["convert.quote-booking"], section.fields);
  if (!fields) return null;
  return (
    <Band id={section.id} group={section.group} label="Quote" className="block" wrap="wrap quote" title={tx(site, fields.headline)} body={tx(site, fields.subhead)} icon="request_quote" style={section.style} image={anyPhoto(site)}>
      <form className="card form">
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
          <label>Photos of the dent<input className="field" type="file" accept="image/*" multiple /></label>
          <p className="note">Photos are usually enough for a body-only estimate.</p>
        </div>
        <div className="for-accident">
          <label>Photos, if you have them<input className="field" type="file" accept="image/*" multiple /></label>
          <p className="note">An accurate quote needs an in-person inspection; damage inside the car often doesn't show in photos.</p>
        </div>
        <label>Name<input className="field" name="name" autoComplete="name" /></label>
        <label>Phone<input className="field" name="phone" autoComplete="tel" /></label>
        <label className="check"><input type="checkbox" name="contact" /> I agree to be contacted about this quote.</label>
        {site.business.market === "US" ? <label className="check"><input type="checkbox" name="sms" /> I agree to receive SMS about this request. Consent is not required to get an estimate. Message and data rates may apply. Reply STOP to cancel.</label> : null}
        <label className="check"><input type="checkbox" name="marketing" /> Marketing messages are optional and stay unticked.</label>
        <button className="btn btn-fill" type="button">{tx(site, fields.submitLabel)}</button>
      </form>
    </Band>
  );
}
