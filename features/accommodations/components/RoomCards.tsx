import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/shared/Reveal";
import { ROOMS } from "@/lib/content/rooms";

export function RoomCards() {
  return (
    <Reveal stagger className="room-cards">
      {ROOMS.map((room) => (
        <article className="room-card" key={room.slug}>
          <div className={`room-card-media ${room.placeholder}`}>
            <Image src={room.images[0]} alt={room.alt} fill sizes="(min-width: 861px) 33vw, 100vw" />
          </div>
          <div className="room-card-info">
            <div>
              <h3 className="room-card-name">{room.name}</h3>
              <p className="room-card-specs">{room.occupancy}</p>
            </div>
            <div className="room-card-actions">
              {room.bookHref.startsWith("/") ? (
                <Link href={room.bookHref} className="room-card-cta solid">
                  Book Now
                </Link>
              ) : (
                <a href={room.bookHref} className="room-card-cta solid">
                  Book Now
                </a>
              )}
              <Link href="/resorts/accommodations" className="room-card-cta outline">
                View Room
              </Link>
            </div>
          </div>
        </article>
      ))}
    </Reveal>
  );
}
