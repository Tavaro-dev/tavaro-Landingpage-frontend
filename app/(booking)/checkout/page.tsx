import Link from "next/link";
import { CheckoutFlow } from "@/features/booking/components/CheckoutFlow";
import { pageMetadata } from "@/lib/metadata";
import { CONTACT, DEMO_SERVICES } from "@/lib/env";

export const metadata = {
  ...pageMetadata({
    title: "Checkout | Tavaro",
    description: "Review your stay, add enhancements, and confirm your Tavaro booking.",
    path: "/checkout",
  }),
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="section on-dark tw:pt-[170px]">
      <div className="container">
        {DEMO_SERVICES ? (
          <CheckoutFlow />
        ) : (
          // No booking backend yet: online checkout is off in production.
          <div className="center-col tw:py-[60px] tw:px-[0]">
            <h1 className="display-2">Online booking is coming soon</h1>
            <p className="lede tw:mt-[20px] tw:max-w-[52ch] tw:ml-auto tw:mr-auto">
              Check live rates with our booking partners, or reach our reservations team on {CONTACT.phone} /{" "}
              {CONTACT.email}.
            </p>
            <div className="tw:mt-[32px] tw:flex tw:gap-[18px] tw:justify-center tw:flex-wrap">
              <Link href="/resorts#availability" className="btn solid">
                Check Availability
              </Link>
              <Link href="/contact" className="btn">
                Contact Us
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
