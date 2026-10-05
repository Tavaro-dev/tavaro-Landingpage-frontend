import { Reveal } from "@/components/shared/Reveal";
import { RESORT_LOCATION_POINTS, RESORT_DISTANCE_INFO } from "../content/resortLocation";

export function ResortLocation() {
  const landmarks = RESORT_LOCATION_POINTS.filter((p) => p.type === "landmark");

  return (
    <>
      <section className="section tight" style={{ paddingBottom: "40px", paddingTop: "clamp(180px, 22vh, 260px)" }}>
        <div className="container">
          <Reveal>
            <h1 className="display-1" style={{ textAlign: "center", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
              Tavaro Resorts
              <br />
              <span style={{ color: "var(--muted-on-light)" }}>Kokapet, Hyderabad</span>
            </h1>
          </Reveal>
        </div>
      </section>

      <section className="section tight" style={{ paddingTop: 0, paddingBottom: "120px" }}>
        <div className="container">
          <Reveal>
            <div style={{ maxWidth: "1000px", margin: "0 auto 60px" }}>
              <div style={{
                width: "100%",
                height: "clamp(400px, 55vh, 550px)",
                border: "1px solid var(--surface-line)",
                borderRadius: "4px",
                overflow: "hidden",
                background: "var(--cream-2)",
                boxShadow: "0 8px 30px rgba(0,0,0,0.04)"
              }}>
                <iframe
                  title="Google Maps Location Preview"
                  src="https://maps.google.com/maps?q=Kokapet%2C%20Hyderabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>

            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 40px 0" }}>
                {landmarks.map((point) => (
                  <li key={point.id} style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    borderBottom: "1px solid var(--surface-line)", 
                    padding: "20px 0",
                    fontFamily: "var(--font-sans)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "13px"
                  }}>
                    <span>{point.name}</span>
                    <span style={{ color: "var(--muted-on-light)" }}>{point.travelTime}</span>
                  </li>
                ))}
              </ul>

              <div style={{ textAlign: "center", marginBottom: "48px" }}>
                <p style={{ 
                  fontFamily: "var(--font-sans)", 
                  textTransform: "uppercase", 
                  letterSpacing: "0.05em", 
                  fontSize: "12px", 
                  color: "var(--muted-on-light)" 
                }}>
                  {RESORT_DISTANCE_INFO}
                </p>
              </div>

              <div style={{ textAlign: "center" }}>
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
