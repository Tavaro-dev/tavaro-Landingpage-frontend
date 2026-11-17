import Link from "next/link";
import { OfferHead } from "@/components/shared/OfferHead";
import { RoomListing } from "@/features/accommodations/components/RoomListing";
import { CartStickyBar } from "@/features/booking/components/CartStickyBar";
import { pageMetadata } from "@/lib/metadata";
import { bookingService } from "@/lib/booking/service";
import { DEMO_SERVICES } from "@/lib/env";

export const metadata = pageMetadata({
  title: "Accommodations — Availability | Tavaro Resorts",
  description: "Browse room availability at Tavaro Resorts, Kokapet — Executive Rooms, Suites and Tavaro House.",
  path: "/resorts/accommodations",
});

export default async function AccommodationsPage(props: PageProps<"/resorts/accommodations">) {
  const params = await props.searchParams;
  const checkin = typeof params.checkin === "string" ? params.checkin : undefined;
  const checkout = typeof params.checkout === "string" ? params.checkout : undefined;
  const guests = typeof params.guests === "string" ? params.guests : undefined;
  const roomType = typeof params.roomType === "string" ? params.roomType : undefined;
  const hasSearch = Boolean(checkin || checkout);

  const searchSummary = [
    checkin && checkout ? `${checkin} → ${checkout}` : null,
    guests ? `${guests} guests` : null,
    roomType && roomType !== "Any" ? roomType : null,
  ]
    .filter(Boolean)
    .join(" · ");

  const availableRooms = await bookingService.searchAvailability({
    checkIn: checkin ?? "",
    checkOut: checkout ?? "",
    guests: guests ? parseInt(guests, 10) : 2,
    roomType: roomType === "Any" ? undefined : roomType,
  });

  return (
    <section className="section on-dark tw:pt-[170px]">
      <div className="container">
        <Link href="/resorts" className="text-link tw:mb-[30px] tw:inline-flex">
          ← Back to Resorts
        </Link>
        <OfferHead
          as="h1"
          eyebrow="Availability"
          heading={hasSearch ? "Rooms for your stay" : "All Accommodations"}
          lede={
            hasSearch
              ? searchSummary
              : "13 keys across the estate, from Executive Rooms to the exclusive Tavaro House."
          }
        />
        <RoomListing availability={availableRooms} />
        <p className="lede tw:mt-[40px] tw:max-w-[60ch]">
          {DEMO_SERVICES
            ? "This is a demo availability search — add rooms to your cart, then book now. Real-time pricing and confirmed availability are handled by our reservations team."
            : "Prices shown are indicative. Live rates and confirmed availability are provided by our booking partners."}
        </p>
      </div>
      {DEMO_SERVICES && <CartStickyBar />}
    </section>
  );
}
