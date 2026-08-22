import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section on-dark" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="container center-col">
        <p className="eyebrow center no-line" style={{ display: "flex", justifyContent: "center" }}>
          Tavaro
        </p>
        <h1 className="display-2 italic" style={{ marginTop: 24 }}>
          This path doesn&apos;t lead anywhere yet.
        </h1>
        <p className="lede" style={{ marginTop: 20, maxWidth: "48ch", marginLeft: "auto", marginRight: "auto" }}>
          The page you&apos;re looking for may have moved, or never existed. Let&apos;s get you back to
          somewhere real.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/" className="btn solid">
            Back to Home
          </Link>
          <Link href="/contact" className="btn">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
