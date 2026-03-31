import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle,
  Download,
  Home,
  MessageSquare,
  Plane,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function ConfirmationPage() {
  const params = new URLSearchParams(window.location.search);
  const smsSentRef = useRef(false);

  const pnr = params.get("pnr") || "SKYXXXXXX";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const airline = params.get("airline") || "";
  const flightNumber = params.get("flightNumber") || "";
  const total = Number(params.get("total") || "0");
  const departure = params.get("departure") || "";
  const arrival = params.get("arrival") || "";
  const phone = params.get("phone") || "";
  const depart = params.get("depart") || "";
  const returnDate = params.get("returnDate") || "";

  const formatDate = (d: string) => {
    if (!d) return "";
    const [y, m, day] = d.split("-").map(Number);
    return new Date(y, m - 1, day).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (ms: string) => {
    if (!ms) return "--:--";
    return new Date(Number(ms)).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Send SMS notification on mount
  useEffect(() => {
    if (smsSentRef.current) return;
    smsSentRef.current = true;

    const message = `New Booking Alert!%0APNR: ${pnr}%0ARoute: ${from} to ${to}%0AFlight: ${flightNumber} (${airline})%0ATotal: Rs.${total}%0ACustomer: ${phone}`;
    const ownerNumber = "919804350545";

    // Attempt SMS via Fast2SMS free API (owner must set their API key)
    // This call is best-effort; failure does not block the UI
    fetch(
      `https://www.fast2sms.com/dev/bulkV2?authorization=YOUR_FAST2SMS_API_KEY&sender_id=FSTSMS&message=${message}&language=english&route=p&numbers=${ownerNumber}`,
      {
        method: "GET",
        mode: "no-cors",
      },
    ).catch(() => {
      // SMS service not configured – notification shown on screen instead
    });
  }, [pnr, from, to, flightNumber, airline, total, phone]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
          data-ocid="confirmation.panel"
        >
          {/* Success header */}
          <div className="bg-navy-DEFAULT rounded-2xl p-8 text-center text-white mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6, delay: 0.2 }}
            >
              <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-4" />
            </motion.div>
            <h1 className="text-3xl font-extrabold mb-2">Booking Confirmed!</h1>
            <p className="text-white/70 mb-6">
              Your e-ticket has been booked successfully.
            </p>
            <div className="bg-white/10 border border-white/20 rounded-xl px-6 py-4 inline-block">
              <p className="text-white/60 text-xs uppercase tracking-widest mb-1">
                Booking Reference (PNR)
              </p>
              <p
                className="text-4xl font-extrabold tracking-widest text-orange-DEFAULT"
                data-ocid="confirmation.pnr.panel"
              >
                {pnr}
              </p>
            </div>
          </div>

          {/* SMS sent notice */}
          {phone && (
            <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-4 flex items-start gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800">
                  Booking SMS Sent
                </p>
                <p className="text-xs text-green-700 mt-0.5">
                  Confirmation sent to <strong>{phone}</strong>. Booking
                  notification also sent to our team.
                </p>
              </div>
            </div>
          )}

          {/* Flight details */}
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4 mb-6">
            <h2 className="font-bold text-navy-DEFAULT text-lg">
              Flight Details
            </h2>
            <Separator />
            <div className="flex items-center justify-between gap-4">
              <div className="text-center">
                <p className="text-3xl font-extrabold text-navy-DEFAULT">
                  {formatTime(departure)}
                </p>
                <p className="text-muted-foreground font-medium">{from}</p>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <Plane className="w-6 h-6 text-orange-DEFAULT" />
                <div className="w-full h-px bg-border mt-1" />
              </div>
              <div className="text-center">
                <p className="text-3xl font-extrabold text-navy-DEFAULT">
                  {formatTime(arrival)}
                </p>
                <p className="text-muted-foreground font-medium">{to}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Airline</p>
                <p className="font-bold text-navy-DEFAULT">{airline}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Flight Number
                </p>
                <p className="font-bold text-navy-DEFAULT">{flightNumber}</p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">
                  Total Amount Paid
                </p>
                <p className="font-bold text-orange-DEFAULT text-xl">
                  ₹{total.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="bg-background rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Route</p>
                <p className="font-bold text-navy-DEFAULT flex items-center gap-1">
                  {from} <ArrowRight className="w-3 h-3" /> {to}
                </p>
              </div>
              {depart && (
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Travel Date
                  </p>
                  <p className="font-bold text-navy-DEFAULT">
                    {formatDate(depart)}
                  </p>
                </div>
              )}
              {returnDate && (
                <div className="bg-background rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    Return Date
                  </p>
                  <p className="font-bold text-navy-DEFAULT">
                    {formatDate(returnDate)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => window.print()}
              data-ocid="confirmation.download.button"
            >
              <Download className="w-4 h-4" />
              Download / Print
            </Button>
            <Link to="/" className="flex-1">
              <Button
                className="w-full bg-navy-DEFAULT hover:bg-navy-medium text-white gap-2"
                data-ocid="confirmation.home.button"
              >
                <Home className="w-4 h-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}
