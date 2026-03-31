import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllBookings } from "@/hooks/useQueries";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Calendar,
  Eye,
  EyeOff,
  Lock,
  Menu,
  Phone,
  Plane,
  Tag,
} from "lucide-react";
import { useState } from "react";

const ADMIN_PASSWORD = "AmritSingh";

function AllBookingsPanel() {
  const { data: bookings, isLoading } = useGetAllBookings();

  if (isLoading) {
    return (
      <div className="space-y-4 mt-4" data-ocid="bookings.loading_state">
        {[1, 2, 3].map((i) => (
          <div key={i} className="border rounded-lg p-4 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-16 text-center"
        data-ocid="bookings.empty_state"
      >
        <Plane className="w-12 h-12 text-muted-foreground mb-3" />
        <p className="text-sm text-muted-foreground">No bookings found</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4" data-ocid="bookings.list">
      {bookings.map((booking, idx) => {
        const depTime = new Date(
          Number(booking.flight.departureTime) / 1_000_000,
        );
        const totalAmt = Number(booking.totalAmount);
        const fmtAmount = Number.isNaN(totalAmt)
          ? "--"
          : `₹${totalAmt.toLocaleString("en-IN")}`;
        const fmtDate = depTime.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
        const fmtTime = depTime.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });

        return (
          <div
            key={booking.pnr}
            className="border border-border rounded-xl p-4 bg-white shadow-sm space-y-3"
            data-ocid={`bookings.item.${idx + 1}`}
          >
            {/* Flight route header */}
            <div className="flex items-center gap-2">
              <Plane className="w-4 h-4 text-orange-DEFAULT flex-shrink-0" />
              <span className="font-bold text-navy-DEFAULT text-sm">
                {booking.flight.origin} → {booking.flight.destination}
              </span>
              <span className="ml-auto text-xs bg-orange-DEFAULT/10 text-orange-DEFAULT font-semibold px-2 py-0.5 rounded-full">
                {booking.flight.airline}
              </span>
            </div>

            {/* Flight details */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                <span>
                  Flight:{" "}
                  <span className="font-medium text-foreground">
                    {booking.flight.flightNumber}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>
                  {fmtDate} {fmtTime}
                </span>
              </div>
              <div className="col-span-2">
                PNR:{" "}
                <span className="font-bold text-navy-DEFAULT tracking-wider">
                  {booking.pnr}
                </span>
              </div>
              <div className="col-span-2 font-semibold text-green-700">
                Total: {fmtAmount}
              </div>
            </div>

            {/* Passengers */}
            {booking.passengers.length > 0 && (
              <div className="pt-2 border-t border-border space-y-1">
                <p className="text-xs font-semibold text-navy-DEFAULT mb-1">
                  Passengers
                </p>
                {booking.passengers.map((p, pi) => (
                  <div
                    key={`${p.name}-${pi}`}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-foreground">
                      {p.name}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {p.phone || "—"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function AdminPasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [pwd, setPwd] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pwd === ADMIN_PASSWORD) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
      setPwd("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-white border border-border rounded-2xl p-8 w-full max-w-sm shadow-sm">
        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-navy-DEFAULT/10 flex items-center justify-center mb-3">
            <Lock className="w-6 h-6 text-navy-DEFAULT" />
          </div>
          <h2 className="text-lg font-bold text-navy-DEFAULT">Admin Access</h2>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Enter the admin password to view all bookings
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Input
              type={showPwd ? "text" : "password"}
              placeholder="Enter password"
              value={pwd}
              onChange={(e) => {
                setPwd(e.target.value);
                setError(false);
              }}
              className={`pr-10 ${error ? "border-red-500 focus-visible:ring-red-500" : ""}`}
              autoFocus
            />
            <button
              type="button"
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              tabIndex={-1}
            >
              {showPwd ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {error && (
            <p className="text-xs text-red-500">
              Incorrect password. Try again.
            </p>
          )}
          <Button
            type="submit"
            className="w-full bg-navy-DEFAULT hover:bg-navy-medium text-white"
          >
            Unlock
          </Button>
        </form>
      </div>
    </div>
  );
}

export default function Navbar() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const [sheetOpen, setSheetOpen] = useState(false);
  const [adminUnlocked, setAdminUnlocked] = useState(false);

  const handleSheetOpenChange = (open: boolean) => {
    setSheetOpen(open);
    if (!open) {
      // Lock again when panel closes
      setAdminUnlocked(false);
    }
  };

  const navLinks = [
    { label: "Flights", href: "/" },
    { label: "My Bookings", href: "/my-bookings" },
    { label: "Check-In", href: "/my-bookings" },
    { label: "Offers", href: "/" },
    { label: "Help", href: "/" },
  ];

  return (
    <header className="w-full">
      {/* Utility bar */}
      <div className="bg-navy-dark text-white/70 text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex justify-end gap-6">
          <Link
            to="/my-bookings"
            className="hover:text-white transition-colors"
            data-ocid="nav.my_bookings.link"
          >
            My Bookings
          </Link>
          <Link to="/" className="hover:text-white transition-colors">
            Deals
          </Link>
          <Link to="/" className="hover:text-white transition-colors">
            Flight Status
          </Link>
          <Link to="/" className="hover:text-white transition-colors">
            Support
          </Link>
        </div>
      </div>

      {/* Main nav */}
      <nav className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex items-center h-16 gap-8">
          {/* Brand */}
          <Link
            to="/"
            className="flex flex-col leading-none"
            data-ocid="nav.home.link"
          >
            <span className="text-2xl font-extrabold text-navy-DEFAULT tracking-tight">
              SKYBOOK
            </span>
            <span className="text-[10px] font-semibold text-orange-DEFAULT tracking-widest uppercase -mt-0.5">
              India
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  pathname === link.href && link.href !== "/"
                    ? "text-navy-DEFAULT bg-secondary"
                    : "text-foreground/70 hover:text-navy-DEFAULT hover:bg-secondary"
                }`}
                data-ocid={`nav.${link.label.toLowerCase().replace(/\s+/g, "_")}.link`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm font-semibold text-navy-DEFAULT hidden sm:flex items-center gap-1">
              <span className="text-base">₹</span> INR
            </span>
            <Button
              size="sm"
              className="bg-navy-DEFAULT hover:bg-navy-medium text-white text-sm"
              data-ocid="nav.login.button"
            >
              Login / Sign Up
            </Button>

            {/* Hamburger menu — all bookings (password protected) */}
            <Sheet open={sheetOpen} onOpenChange={handleSheetOpenChange}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-navy-DEFAULT hover:bg-secondary"
                  data-ocid="nav.bookings.open_modal_button"
                  aria-label="View all bookings"
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md flex flex-col"
                data-ocid="nav.bookings.sheet"
              >
                <SheetHeader className="border-b border-border pb-4">
                  <SheetTitle className="text-navy-DEFAULT flex items-center gap-2">
                    <Plane className="w-5 h-5 text-orange-DEFAULT" />
                    All Bookings
                  </SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto pr-1">
                  {adminUnlocked ? (
                    <AllBookingsPanel />
                  ) : (
                    <AdminPasswordGate
                      onUnlock={() => setAdminUnlocked(true)}
                    />
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
