"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Reveal } from "@/components/shared/Reveal";
import { Icon } from "@/components/ui/Icon";
import { getUpcomingEvents, getPastEvents, formatEventBadge, type EventItem } from "@/lib/content/events";
import styles from "./experiences.module.css";

type Tab = "upcoming" | "past";
const TAB_LABELS: Record<Tab, string> = { upcoming: "Coming up", past: "Past experiences" };

const monthYear = (iso: string) => `${formatEventBadge(iso).month} ${iso.slice(0, 4)}`;

function EventCard({ event, past }: { event: EventItem; past: boolean }) {
  const href = `/experiences/${event.id}`;
  const { day, month } = event.date ? formatEventBadge(event.date) : { day: "", month: "" };
  return (
    <article className={styles.card}>
      {/* The title link is the keyboard stop; the photo is a pointer shortcut to the same page. */}
      <Link href={href} className={`${styles.media} ${event.placeholder}`} tabIndex={-1}>
        <Image
          src={event.src}
          alt={event.alt}
          fill
          sizes="(min-width: 1081px) 30vw, (min-width: 601px) 45vw, 80vw"
        />
        {past ? (
          <span className={styles.recap}>
            <Icon name="play" />
            Recap
          </span>
        ) : (
          <span className={styles.badge}>
            <strong>{day}</strong> {month}
          </span>
        )}
      </Link>
      <p className={styles.meta}>
        <span className={styles.diamond} aria-hidden="true" />
        {past ? event.date && monthYear(event.date) : event.venue}
        {(past ? event.date : event.venue) && <span aria-hidden="true">·</span>}
        {event.category}
      </p>
      <h3 className={styles.title}>
        <Link href={href}>{event.title}</Link>
      </h3>
      {past && event.quote ? (
        <p className={styles.quote}>&ldquo;{event.quote}&rdquo;</p>
      ) : (
        <p className={styles.desc}>{event.description}</p>
      )}
      {past ? (
        <Link href={href} className={`text-link ${styles.cta}`}>
          View recap <Icon name="arrow" className="icon-arrow" />
        </Link>
      ) : (
        <Link href={href} className={`btn sm ${styles.cta}`}>
          Book tickets
        </Link>
      )}
    </article>
  );
}

/**
 * The experiences calendar: what can be booked next, and recaps of what has happened.
 * Opens on "Coming up" when anything is announced, otherwise on the recaps.
 */
export function EventsSection() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  const [tab, setTab] = useState<Tab>(upcoming.length ? "upcoming" : "past");
  const list = tab === "upcoming" ? upcoming : past;

  return (
    <>
      <div className={styles["events-tabs"]} role="tablist" aria-label="Experiences">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            id={`exp-tab-${t}`}
            aria-selected={tab === t}
            aria-controls="exp-panel"
            className={`${styles["events-tab"]}${tab === t ? " active" : ""}`}
            onClick={() => setTab(t)}
          >
            {TAB_LABELS[t]}
          </button>
        ))}
      </div>

      <div id="exp-panel" role="tabpanel" aria-labelledby={`exp-tab-${tab}`} className={styles.panel} key={tab}>
        {list.length ? (
          <Reveal stagger className={styles.grid}>
            {list.map((event) => (
              <EventCard event={event} past={tab === "past"} key={event.id} />
            ))}
          </Reveal>
        ) : (
          <div className={styles.empty}>
            <span className={styles.diamond} aria-hidden="true" />
            <div>
              <h3 className={styles.title}>Nothing announced just now</h3>
              <p className={styles.desc}>
                New experiences are announced here first. Tell us what you&apos;d like to see, or
                shape a gathering of your own with our team.
              </p>
              <div className={styles["empty-actions"]}>
                <Link href="/contact" className="btn solid sm">
                  Enquire
                </Link>
                {past.length > 0 && (
                  <button type="button" className={`text-link ${styles["link-btn"]}`} onClick={() => setTab("past")}>
                    See past experiences <Icon name="arrow" className="icon-arrow" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
