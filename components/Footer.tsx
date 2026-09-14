import Link from "next/link";
import { Icon } from "./Icon";
import { NAV_ITEMS, FOOTER_JOURNEYS } from "@/lib/nav";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div className="footer-brand">
            <Link href="/" className="logo">
              <span>
                <Icon name="logo" />
              </span>
              <span className="logo-word">TAVARO</span>
            </Link>
            <p>
              Discover the world between worlds. A hospitality and lifestyle group creating places and
              experiences around a more meaningful way of living.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Instagram">
                <Icon name="instagram" />
              </a>
              <a href="#" aria-label="Facebook">
                <Icon name="facebook" />
              </a>
              <a href="#" aria-label="WhatsApp">
                <Icon name="whatsapp" />
              </a>
            </div>
          </div>
          <div className="footer-col">
            <h5>Explore</h5>
            <ul>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Tavaro</h5>
            <ul>
              <li>
                <Link href="/about">About Tavaro</Link>
              </li>
              <li>
                <Link href="/contact">Contact</Link>
              </li>
              <li>
                <Link href="/contact">Careers</Link>
              </li>
              <li>
                <Link href="/contact">Press</Link>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h5>Journeys</h5>
            <ul>
              {FOOTER_JOURNEYS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h5>Reach Us</h5>
            <ul>
              <li>
                <a href="tel:+919989983029">+91 998 998 3029</a>
              </li>
              <li>
                <a href="mailto:celebrate@tavaro.in">celebrate@tavaro.in</a>
              </li>
              <li>
                <a href="#">Kokapet, Hyderabad</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Tavaro Group. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
