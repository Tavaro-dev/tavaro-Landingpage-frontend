"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useShareLink } from "@/lib/useShareLink";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/features/booking/cart/CartProvider";
import { formatInr } from "@/lib/format";
import { DEMO_SERVICES } from "@/lib/env";
import { ThirdPartyBookingModal } from "./ThirdPartyBookingModal";

import type { RoomAvailability } from "@/lib/booking/types";
import styles from "./accommodations.module.css";

function RoomListingCard({ availability, onBook }: { availability: RoomAvailability; onBook: () => void }) {
  const { room } = availability;
  const [imageIndex, setImageIndex] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const prev = () => setImageIndex((i) => (i === 0 ? room.images.length - 1 : i - 1));
  const next = () => setImageIndex((i) => (i === room.images.length - 1 ? 0 : i + 1));

  const handleAdd = () => {
    // Note: We are pushing the user's intent to book this room to the cart.
    // This is NOT an inventory reservation. The cart is not authoritative.
    addItem({ slug: room.slug, name: room.name, image: room.images[0], pricePerNight: room.pricePerNight });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <article className="room-listing-card" id={room.slug}>
      <div className={`${styles["room-listing-media"]} ${room.placeholder}`}>
        <Image src={room.images[imageIndex]} alt={room.alt} fill sizes="(min-width: 861px) 45vw, 100vw" />
        {room.images.length > 1 && (
          <>
            <button type="button" className={`${styles["room-listing-nav"]} prev`} onClick={prev} aria-label="Previous photo">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className={`${styles["room-listing-nav"]} next`} onClick={next} aria-label="Next photo">
              <Icon name="chevron-right" />
            </button>
            <span className={styles["room-listing-counter"]}>
              {imageIndex + 1} / {room.images.length}
            </span>
          </>
        )}
      </div>

      <div className={styles["room-listing-details"]}>
        <div>
          <h3 className={styles["room-listing-name"]}>{room.name}</h3>
          <ul className="room-listing-specs">
            <li>
              <Icon name="bed" /> {room.bed}
            </li>
            <li>
              <Icon name="expand" /> {room.size}
            </li>
            <li>
              <Icon name="people" /> {room.occupancy}
            </li>
          </ul>
          <Link href="/contact" className="text-link">
            View Floor Plan &amp; Details
          </Link>
        </div>

        <div className={styles["room-listing-rate"]}>
          <div>
            <p className={styles["room-listing-rate-name"]}>{room.rate}</p>
            <p className={styles["room-listing-refund"]}>{room.refundNote}</p>
          </div>
          <div className="room-listing-price">
            <span>Avg. price per night</span>
            <strong>{formatInr(room.pricePerNight)}</strong>
          </div>
          {DEMO_SERVICES ? (
            <button type="button" className="btn solid" onClick={handleAdd} disabled={!availability.available}>
              {!availability.available ? "Unavailable" : added ? "Added ✓" : "Add to Cart"}
            </button>
          ) : (
            // No booking backend yet: send guests to the third-party partners.
            <button type="button" className="btn solid" onClick={onBook}>
              Check Rates
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function RoomListing({ availability }: { availability: readonly RoomAvailability[] }) {
  const [bookingOpen, setBookingOpen] = useState(false);
  useShareLink("#book-stay", () => setBookingOpen(true));
  return (
    <div className={styles["room-listings"]}>
      <h2 className="display-3 tw:mb-[30px]">
        Guest Rooms ({availability.length})
      </h2>
      {availability.map((av) => (
        <RoomListingCard availability={av} key={av.room.slug} onBook={() => setBookingOpen(true)} />
      ))}
      {!DEMO_SERVICES && <ThirdPartyBookingModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />}
    </div>
  );
}
