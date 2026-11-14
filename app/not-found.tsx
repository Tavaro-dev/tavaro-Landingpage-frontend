import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section on-dark tw:min-h-[70vh] tw:flex tw:items-center">
      <div className="container center-col">
        <p className="eyebrow center no-line tw:flex tw:justify-center">
          Tavaro
        </p>
        <h1 className="display-2 italic tw:mt-[24px]">
          This path doesn&apos;t lead anywhere yet.
        </h1>
        <p className="lede tw:mt-[20px] tw:max-w-[48ch] tw:ml-auto tw:mr-auto">
          The page you&apos;re looking for may have moved, or never existed. Let&apos;s get you back to
          somewhere real.
        </p>
        <div className="tw:mt-[40px] tw:flex tw:gap-[18px] tw:justify-center tw:flex-wrap">
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
