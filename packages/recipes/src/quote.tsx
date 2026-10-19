import { recipeFields } from "./fields";
import { Band, readFields, tx, type Block } from "./parts";

export function Quote({ site, section }: Block) {
  const fields = readFields(recipeFields["convert.quote-booking"], section.fields);
  if (!fields) return null;
  return (
    <Band id={fields.formId} className="block" wrap="wrap quote" title={tx(site, fields.headline)} body={tx(site, fields.subhead)}>
      <form className="card form">
        <fieldset className="job-pick">
          <legend>What do you need?</legend>
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
        <label className="check"><input type="checkbox" name="marketing" /> Marketing messages are optional and stay unticked.</label>
        <button className="btn btn-fill" type="button">{tx(site, fields.submitLabel)}</button>
      </form>
    </Band>
  );
}
