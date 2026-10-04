"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { useCart } from "@/features/booking/cart/CartProvider";
import { formatInr } from "@/lib/format";

import type { RoomAvailability } from "@/lib/booking/types";

function RoomListingCard({ availability }: { availability: RoomAvailability }) {
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
      <div className={`room-listing-media ${room.placeholder}`}>
        <Image src={room.images[imageIndex]} alt={room.alt} fill sizes="(min-width: 861px) 45vw, 100vw" />
        {room.images.length > 1 && (
          <>
            <button type="button" className="room-listing-nav prev" onClick={prev} aria-label="Previous photo">
              <Icon name="chevron-left" />
            </button>
            <button type="button" className="room-listing-nav next" onClick={next} aria-label="Next photo">
              <Icon name="chevron-right" />
            </button>
            <span className="room-listing-counter">
              {imageIndex + 1} / {room.images.length}
            </span>
          </>
        )}
      </div>

      <div className="room-listing-details">
        <div>
          <h3 className="room-listing-name">{room.name}</h3>
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

        <div className="room-listing-rate">
          <div>
            <p className="room-listing-rate-name">{room.rate}</p>
            <p className="room-listing-refund">{room.refundNote}</p>
          </div>
          <div className="room-listing-price">
            <span>Avg. price per night</span>
            <strong>{formatInr(room.pricePerNight)}</strong>
          </div>
          <button type="button" className="btn solid" onClick={handleAdd} disabled={!availability.available}>
            {!availability.available ? "Unavailable" : added ? "Added ✓" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}

export function RoomListing({ availability }: { availability: readonly RoomAvailability[] }) {
  return (
    <div className="room-listings">
      <h2 className="display-3" style={{ marginBottom: 30 }}>
        Guest Rooms ({availability.length})
      </h2>
      {availability.map((av) => (
        <RoomListingCard availability={av} key={av.room.slug} />
      ))}
    </div>
  );
}
