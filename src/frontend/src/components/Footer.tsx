import { Link } from "@tanstack/react-router";

export default function Footer() {
  const year = new Date().getFullYear();
  const hostname =
    typeof window !== "undefined" ? window.location.hostname : "";

  return (
    <footer className="bg-navy-DEFAULT text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex flex-col leading-none mb-4">
              <span className="text-2xl font-extrabold tracking-tight">
                SKYBOOK
              </span>
              <span className="text-[10px] font-semibold text-orange-DEFAULT tracking-widest uppercase -mt-0.5">
                India
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              India's trusted domestic flight booking platform. Travel smart,
              travel India.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="hover:text-white transition-colors"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="hover:text-white transition-colors"
                >
                  Check-In Online
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Flight Status
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Popular Routes
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Delhi → Mumbai</li>
              <li>Mumbai → Bangalore</li>
              <li>Delhi → Goa</li>
              <li>Hyderabad → Chennai</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-sm mb-4 text-white/90">
              Support
            </h4>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Baggage Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-white/50 text-sm">
            All prices are in Indian Rupees (₹). © {year} SkyBook India. All
            rights reserved.
          </p>
          <p className="text-white/40 text-xs">
            Built with ♥ using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-DEFAULT hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
