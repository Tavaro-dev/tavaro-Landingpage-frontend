"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getUpcomingEvents, getPastEvents, formatEventBadge } from "@/lib/content/events";

const TABS = ["All", "Upcoming", "Past"] as const;
type Tab = (typeof TABS)[number];

export function EventsSection() {
  const [tab, setTab] = useState<Tab>("All");
  const showUpcoming = tab !== "Past";
  const showPast = tab !== "Upcoming";
  const upcomingEvents = getUpcomingEvents();
  const pastEvents = getPastEvents();

  return (
    <>
      <div className="events-tabs">
        {TABS.map((t) => (
          <button
            key={t}
            type="button"
            className={`events-tab${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      {showUpcoming && (
        <Reveal stagger className="event-grid">
          {upcomingEvents.map((event) => {
            const { day, month } = formatEventBadge(event.date);
            return (
              <article className="event-card" key={event.id}>
                <Link href={`/experiences/${event.id}`} className={`event-media ${event.placeholder}`}>
                  <span className="event-date-badge">
                    <span>{day}</span> {month}
                  </span>
                  <Image
                    src={event.src}
                    alt={event.alt}
                    fill
                    sizes="(min-width: 1081px) 33vw, (min-width: 521px) 50vw, 100vw"
                  />
                </Link>
                <p className="event-category">{event.category}</p>
                <h3 className="event-title">
                  <Link href={`/experiences/${event.id}`}>{event.title}</Link>
                </h3>
                <p className="event-meta">{event.description}</p>
                <Link href={`/experiences/${event.id}`} className="btn sm" style={{ marginTop: 18 }}>
                  Book Tickets
                </Link>
              </article>
            );
          })}
        </Reveal>
      )}

      {showPast && (
        <Reveal stagger className="event-grid" style={{ marginTop: showUpcoming ? 40 : 0 }}>
          {pastEvents.map((event) => (
            <article className="event-card" key={event.id}>
              <Link href={`/experiences/${event.id}`} className={`event-media ${event.placeholder}`}>
                <Image
                  src={event.src}
                  alt={event.alt}
                  fill
                  sizes="(min-width: 1081px) 33vw, (min-width: 521px) 50vw, 100vw"
                />
                <span className="event-play-badge">
                  <Icon name="play" />
                </span>
              </Link>
              <p className="event-category">{event.stat}</p>
              <h3 className="event-title">
                <Link href={`/experiences/${event.id}`}>{event.title}</Link>
              </h3>
              <p className="event-quote">&ldquo;{event.quote}&rdquo;</p>
              <Link href={`/experiences/${event.id}`} className="btn sm" style={{ marginTop: 4 }}>
                Watch Recap
              </Link>
            </article>
          ))}
        </Reveal>
      )}
    </>
  );
}
