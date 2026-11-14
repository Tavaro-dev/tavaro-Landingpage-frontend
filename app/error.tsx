"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section on-dark" style={{ minHeight: "70vh", display: "flex", alignItems: "center" }}>
      <div className="container center-col">
        <h1 className="display-2 italic">Something went wrong.</h1>
        <p className="lede" style={{ marginTop: 20, maxWidth: "48ch", marginLeft: "auto", marginRight: "auto" }}>
          This page hit an unexpected problem. Please try again.
        </p>
        <div style={{ marginTop: 40, display: "flex", gap: 18, justifyContent: "center", flexWrap: "wrap" }}>
          <button type="button" className="btn solid" onClick={() => retry()}>
            Try Again
          </button>
          <Link href="/" className="btn">
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
