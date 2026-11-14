import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { ROOMS } from "@/lib/content/rooms";
import { AGODA_TAVARO_URL } from "./ThirdPartyBookingModal";
import styles from "./accommodations.module.css";

interface RoomCardsProps {
  onBookClick?: (roomSlug?: string) => void;
}

export function RoomCards({ onBookClick }: RoomCardsProps = {}) {
  return (
    <Reveal stagger className={styles["room-cards"]}>
      {ROOMS.map((room) => (
        <article className={styles["room-card"]} key={room.slug}>
          <div className={`${styles["room-card-media"]} ${room.placeholder}`}>
            <Image src={room.images[0]} alt={room.alt} fill sizes="(min-width: 861px) 33vw, 100vw" />
          </div>
          <div className={styles["room-card-info"]}>
            <div>
              <h3 className={styles["room-card-name"]}>{room.name}</h3>
              <p className={styles["room-card-specs"]}>{room.occupancy}</p>
            </div>
            <div className={styles["room-card-actions"]}>
              {/* =========================================================================
                  RELEASE 1: Opens Third-Party Booking modal (or celebrate enquiry for Tavaro House)
                  RELEASE 2: Revert to internal in-house booking via room.bookHref
                  ========================================================================= */}
              {room.slug === "tavaro-house" ? (
                <Link href="/resorts#celebrate" className={`${styles["room-card-cta"]} solid`}>
                  Enquire Villa
                </Link>
              ) : onBookClick ? (
                <button
                  type="button"
                  onClick={() => onBookClick(room.slug)}
                  className={`${styles["room-card-cta"]} solid`}
                >
                  Book Now
                </button>
              ) : (
                <a
                  href={AGODA_TAVARO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles["room-card-cta"]} solid`}
                >
                  Book on Agoda ↗
                </a>
              )}

              {/* RELEASE 2 IN-HOUSE BOOKING:
              {room.bookHref.startsWith("/") ? (
                <Link href={room.bookHref} className={`${styles["room-card-cta"]} solid`}>
                  Book Now
                </Link>
              ) : (
                <a href={room.bookHref} className={`${styles["room-card-cta"]} solid`}>
                  Book Now
                </a>
              )}
              */}

              <Link href={`/resorts/accommodations#${room.slug}`} className={`${styles["room-card-cta"]} outline`}>
                View Room
              </Link>
            </div>
          </div>
        </article>
      ))}
    </Reveal>
  );
}
