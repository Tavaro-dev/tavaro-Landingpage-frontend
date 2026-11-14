import { Reveal } from "@/components/shared/Reveal";
import styles from "./ResortLocation.module.css";
import { RESORT_LOCATION_POINTS } from "../content/resortLocation";

export function ResortLocation() {
  const landmarks = RESORT_LOCATION_POINTS.filter((p) => p.type === "landmark");

  return (
    <>
      <section className="section tight tw:pb-[40px] tw:pt-[clamp(180px,22vh,260px)]">
        <div className="container">
          <Reveal>
            <h1 className="display-1 tw:text-center tw:uppercase tw:tracking-[-0.02em]">
              Tavaro Resorts
              <br />
              <span className="tw:text-(color:--muted-on-light)">Kokapet, Hyderabad</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section tight tw:pt-[0] tw:pb-[120px]">
        <div className="container">
          <Reveal>
            <div className="tw:max-w-[1000px] tw:mt-[0] tw:mb-[60px] tw:mx-auto">
              <div className={styles["location-map-frame"]}>
                <iframe
                  title="Google Maps Location Preview"
                  src="https://maps.google.com/maps?q=Tavaro+Resorts%2C+Kokapet%2C+Hyderabad&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%" className="tw:border-0"
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div className="tw:max-w-[600px] tw:my-[0] tw:mx-auto">
              <ul className="tw:list-none tw:p-[0] tw:mt-[0] tw:mb-[40px] tw:mx-[0]">
                {landmarks.map((point) => (
                  <li key={point.id} className={styles["location-landmark"]}>
                    <span>{point.name}</span>
                    <span className="tw:text-(color:--muted-on-light)">{point.travelTime}</span>
                  </li>
                ))}
              </ul>

              <div className="tw:text-center">
                <a 
                  href="https://maps.google.com/?q=Tavaro+Resorts,+Kokapet,+Hyderabad" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn"
                >
                  Open in Maps <span className="btn-arrow">→</span>
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
