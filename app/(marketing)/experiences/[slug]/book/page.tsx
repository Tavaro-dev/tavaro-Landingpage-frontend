import Link from "next/link";
import { notFound } from "next/navigation";
import { TicketBooking } from "@/features/experiences/components/TicketBooking";
import { pageMetadata } from "@/lib/metadata";
import { EVENTS, getEvent, isBookable } from "@/lib/content/events";

export function generateStaticParams() {
  return EVENTS.filter((event) => event.ticketTypes?.length).map((event) => ({ slug: event.id }));
}

export async function generateMetadata(props: PageProps<"/experiences/[slug]/book">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event) return pageMetadata({ title: "Not Found | Tavaro", description: "", path: "/experiences" });
  return pageMetadata({
    title: `Book Tickets — ${event.title} | Tavaro`,
    description: `Book tickets for ${event.title} at Tavaro. ${event.description}`,
    path: `/experiences/${event.id}/book`,
  });
}

export default async function BookTicketsPage(props: PageProps<"/experiences/[slug]/book">) {
  const { slug } = await props.params;
  const event = getEvent(slug);
  if (!event || !isBookable(event)) notFound();

  return (
    <section className="section on-dark" style={{ paddingTop: 170 }}>
      <div className="container">
        <Link href={`/experiences/${event.id}`} className="text-link" style={{ marginBottom: 40, display: "inline-flex" }}>
          ← Back to {event.title}
        </Link>
        <TicketBooking event={event} />
      </div>
    </section>
  );
}
