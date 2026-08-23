import { CheckoutFlow } from "@/components/CheckoutFlow";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata({
  title: "Checkout | Tavaro",
  description: "Review your stay, add enhancements, and confirm your Tavaro booking.",
  path: "/checkout",
});

export default function CheckoutPage() {
  return (
    <section className="section on-dark" style={{ paddingTop: 170 }}>
      <div className="container">
        <CheckoutFlow />
      </div>
    </section>
  );
}
