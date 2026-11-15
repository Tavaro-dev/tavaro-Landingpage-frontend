import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/shared/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { EVENTS, getEvent, formatEventSchedule, isBookable, getFromPrice, getBookingDates } from "@/lib/content/events";
import { formatInr } from "@/lib/format";

export function generateStaticParams() {
  return EVENTS.map((event) => ({ slug: event.id }));
}

export async function generateMetadata(props: PageProps<"/experiences/[slug]">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) return pageMetadata({ title: "Experience Not Found | Tavaro", description: "", path: "/experiences" });
  return pageMetadata({
    title: `${event.title} — Tavaro Experiences`,
    description: event.description,
    path: `/experiences/${event.id}`,
    image: event.src,
  });
}

export default async function ExperienceDetailPage(props: PageProps<"/experiences/[slug]">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) notFound();

  const bookable = isBookable(event);
  const fromPrice = getFromPrice(event);
  const multipleSlots = getBookingDates(event).length > 1 || (event.times?.length ?? 0) > 1;
  const schedule = formatEventSchedule(event) + (multipleSlots ? " · Multiple slots" : "");

  const facts = [
    { label: "Venue", value: event.venue },
    { label: "Duration", value: event.duration },
    { label: "Language", value: event.language },
    { label: "Entry", value: event.ageLimit },
    { label: "Layout", value: event.layout },
    { label: "Seating", value: event.seating },
  ].filter((f): f is { label: string; value: string } => Boolean(f.value));

  return (
    <>
      <PageHero
        photoSrc={event.src}
        photoAlt={event.alt}
        placeholder={event.placeholder}
        breadcrumbLabel="Tavaro Experiences"
        eyebrow={event.category}
        title={event.title}
        titleSize="clamp(34px,5.6vw,68px)"
        titleMaxWidth="20ch"
        lede={event.venue ? `${schedule} · ${event.venue}` : schedule}
      />

      <section className="section on-dark">
        <div className="container">
          <Link href="/experiences" className="text-link tw:mb-[30px] tw:inline-flex">
            ← Back to Experiences
          </Link>

          <div className="checkout-layout">
            <div className="checkout-main">
              <h2 className="display-3">About</h2>
              <p className="lede tw:mt-[18px]">
                {event.about}
              </p>

              {facts.length > 0 && (
                <>
                  <h2 className="display-3 tw:mt-[56px]">
                    Things to Know
                  </h2>
                  <ul className="room-listing-specs tw:mt-[22px] tw:flex-row tw:flex-wrap tw:gap-y-[18px] tw:gap-x-[40px]">
                    {facts.map((fact) => (
                      <li key={fact.label} className="tw:flex-none">
                        {fact.label}: {fact.value}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            <div className="order-summary">
              {bookable ? (
                <>
                  <p className="room-listing-price tw:mb-[20px]">
                    <span>Price</span>
                    <strong>{formatInr(fromPrice!)} onwards</strong>
                  </p>
                  <Link
                    href={`/experiences/${event.id}/book`}
                    className="btn solid tw:w-full tw:justify-center"
                  >
                    Book Tickets
                  </Link>
                  <p className="order-summary-muted tw:mt-[14px]">
                    This is a demo booking flow — no payment is taken.
                  </p>
                </>
              ) : event.stat ? (
                <>
                  <p className="order-summary-label tw:m-[0]">
                    {event.stat}
                  </p>
                  <p className="lede tw:mt-[14px] tw:italic">
                    &ldquo;{event.quote}&rdquo;
                  </p>
                  <Link href="/contact" className="btn solid tw:w-full tw:justify-center tw:mt-[20px]">
                    Watch Recap
                  </Link>
                </>
              ) : (
                <>
                  <p className="order-summary-label tw:m-[0]">
                    Tickets Coming Soon
                  </p>
                  <p className="lede tw:mt-[14px]">
                    Booking opens closer to the date.
                  </p>
                  <Link href="/contact" className="btn solid tw:w-full tw:justify-center tw:mt-[20px]">
                    Enquire
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
