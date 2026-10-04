import Image from "next/image";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/shared/Reveal";

export type EventCardData = {
  id: string;
  tag: string;
  placeholder: string;
  src: string;
  alt: string;
  date: string;
  title: string;
  meta: string;
  ctaLabel?: string;
  ctaHref: string;
};

export function EventGrid({ events }: { events: EventCardData[] }) {
  return (
    <Reveal stagger className="event-grid">
      {events.map((event) => (
        <article className="event-card" key={event.id}>
          <div className={`event-media ${event.placeholder}`}>
            <span className="event-tag">{event.tag}</span>
            <Image
              src={event.src}
              alt={event.alt}
              fill
              sizes="(min-width: 1081px) 33vw, (min-width: 521px) 50vw, 100vw"
            />
          </div>
          <p className="event-date">{event.date}</p>
          <h3 className="event-title">{event.title}</h3>
          <p className="event-meta">{event.meta}</p>
          <Link href={event.ctaHref} className="text-link">
            {event.ctaLabel ?? "Register"} <Icon name="arrow" className="icon-arrow" />
          </Link>
        </article>
      ))}
    </Reveal>
  );
}
