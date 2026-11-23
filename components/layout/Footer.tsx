import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { NAV_ITEMS, FOOTER_JOURNEYS } from "@/lib/nav";
import styles from "./layout.module.css";

export default function Footer() {
  return (
    <footer className={styles["site-footer"]}>
      <div className="container">
        <div className={styles["footer-top"]}>
          <div className={styles["footer-brand"]}>
            <Link href="/" className="logo" aria-label="Tavaro home">
              <span className="logo-art" aria-hidden="true" />
            </Link>
            <p>
              Discover the world between worlds. A hospitality and lifestyle group creating places and
              experiences around a more meaningful way of living.
            </p>
            <div className={styles["footer-social"]}>
              <a
                href="https://www.instagram.com/tavaro.resorts"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <Icon name="instagram" />
              </a>
              <a
                href="https://www.facebook.com/p/Tavaro-Resorts-61588547362755/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <Icon name="facebook" />
              </a>
              <a
                href="https://wa.me/919989983029"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <Icon name="whatsapp" />
              </a>
              <a
                href="mailto:celebrate@tavaro.in"
                aria-label="Email"
              >
                <Icon name="mail" />
              </a>
            </div>
          </div>
          <div className={styles["footer-col"]}>
            <h5>Explore</h5>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles["footer-col"]}>
            <h5>Tavaro</h5>
            <ul>
              <li>
                <Link href="/about">About Tavaro</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
            </ul>
          </div>
          <div className={styles["footer-col"]}>
            <h5>Journeys</h5>
            <ul>
              {FOOTER_JOURNEYS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles["footer-col"]}>
            <h5>Reach Us</h5>
            <ul>
              <li>
                <a href="tel:+919989983029">+91 998 998 3029</a>
              </li>
              <li>
                <a
                  href="https://wa.me/919989983029"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </li>
              <li>
                <a href="mailto:celebrate@tavaro.in">celebrate@tavaro.in</a>
              </li>
              <li>
                <Link href="/resorts/location">Kokapet, Hyderabad</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles["footer-bottom"]}>
          <p>© {new Date().getFullYear()} Tavaro Group. All rights reserved.</p>
          {/* TODO: restore Privacy Policy / Terms links once those pages exist */}
        </div>
      </div>
    </footer>
  );
}
