"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="section on-dark tw:min-h-[70vh] tw:flex tw:items-center">
      <div className="container center-col">
        <h1 className="display-2 italic">Something went wrong.</h1>
        <p className="lede tw:mt-[20px] tw:max-w-[48ch] tw:ml-auto tw:mr-auto">
          This page hit an unexpected problem. Please try again.
        </p>
        <div className="tw:mt-[40px] tw:flex tw:gap-[18px] tw:justify-center tw:flex-wrap">
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
