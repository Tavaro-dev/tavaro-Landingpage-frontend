import { CONTACT } from "@/lib/env";
import { CATERING_FROM } from "../../content/venues";
import styles from "./ResortPlan.module.css";

const STEPS = [
  { title: "Send your dates and guest count", body: "On WhatsApp. Venue and room prices are on request." },
  { title: "We check availability", body: "And set up a site visit at a time that suits you." },
  { title: "Walk the resort with us", body: "Pick a space for each function, with our team beside you." },
  {
    title: "Confirm, and we take it from there",
    body: "We coordinate with your planner from then until the last guest leaves.",
  },
];

const WHATSAPP = `${CONTACT.whatsappHref}?text=${encodeURIComponent(
  "Hi Tavaro, we're planning a celebration at the resort.\nDates: \nNumber of guests: \nFunctions: ",
)}`;
const rupees = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export function ResortPlan() {
  return (
    <section className={styles.plan} id="plan" aria-labelledby="plan-title">
      <div className={`container ${styles.wrap}`}>
        <div>
          <h2 id="plan-title" className={styles.title}>
            Plan your celebration
          </h2>
          <ol className={styles.steps}>
            {STEPS.map((s) => (
              <li key={s.title}>
                <h3>{s.title}</h3>
                <p>{s.body}</p>
              </li>
            ))}
          </ol>
          <div className={styles.actions}>
            <a className="btn solid" href={WHATSAPP} target="_blank" rel="noopener noreferrer">
              Send dates on WhatsApp
            </a>
            <a className="btn" href={`mailto:${CONTACT.email}?subject=${encodeURIComponent("Site visit at Tavaro Resorts")}`}>
              Email us
            </a>
          </div>
        </div>

        <aside className={styles.side} aria-label="Food and vendors">
          <div className={styles.price}>
            <h3>In-house catering</h3>
            <p className={styles.from}>
              <span>
                from <strong>{rupees(CATERING_FROM.veg)}</strong> veg
              </span>
              <span>
                from <strong>{rupees(CATERING_FROM.nonVeg)}</strong> non-veg
              </span>
            </p>
            <p className={styles.small}>
              Per plate, taxes extra. Live, interactive kitchens cook in front of your guests. Outside caterers are
              welcome too.
            </p>
          </div>
          <div className={styles.vendors}>
            <h3>Décor and vendors</h3>
            <p>
              Keep it simple with our in-house décor team, or bring your own vendors. We can also introduce
              you to trusted décor, photography, entertainment and planning partners to suit your style and
              budget.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
