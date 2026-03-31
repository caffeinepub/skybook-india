import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

// ── Replace with your actual Razorpay Key ID ──────────────────────────────────
const RAZORPAY_KEY_ID = "rzp_test_YOUR_KEY_HERE";
// ─────────────────────────────────────────────────────────────────────────────

const CONVENIENCE_FEE = 385;

function safeNum(val: string | null, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

function formatTime(ms: string): string {
  if (!ms) return "--:--";
  const n = Number(ms);
  if (!Number.isFinite(n)) return "--:--";
  return new Date(n).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const pnr = params.get("pnr") || "SKYXXXXXX";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const airline = params.get("airline") || "";
  const flightNumber = params.get("flightNumber") || "";
  const total = safeNum(params.get("total"), 0);
  const departure = params.get("departure") || "";
  const arrival = params.get("arrival") || "";
  const phone = params.get("phone") || "";
  const passengersCount = Math.max(
    1,
    safeNum(params.get("passengersCount"), 1),
  );
  const pricePerPax = safeNum(params.get("pricePerPax"), 0);
  const classType = params.get("classType") || "economy";
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

  const fareTotal = pricePerPax * passengersCount || total - CONVENIENCE_FEE;

  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  // Load Razorpay checkout script
  useEffect(() => {
    if (window.Razorpay) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    script.onerror = () =>
      toast.error(
        "Failed to load payment gateway. Check your internet connection.",
      );
    document.body.appendChild(script);
    scriptRef.current = script;
    return () => {
      if (scriptRef.current) document.body.removeChild(scriptRef.current);
    };
  }, []);

  const handlePay = () => {
    if (!scriptLoaded || !window.Razorpay) {
      toast.error(
        "Payment gateway not ready. Please wait a moment and try again.",
      );
      return;
    }
    if (RAZORPAY_KEY_ID === "rzp_test_YOUR_KEY_HERE") {
      toast.error(
        "Razorpay Key ID not configured. Please add your key to PaymentPage.tsx.",
      );
      return;
    }
    setIsPaying(true);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: total * 100, // Razorpay accepts paise
      currency: "INR",
      name: "SkyBook India",
      description: `Flight ${flightNumber} — ${from} to ${to}`,
      image: "/logo.png",
      prefill: {
        contact: phone,
      },
      notes: {
        pnr,
        flight: flightNumber,
        route: `${from} → ${to}`,
      },
      theme: {
        color: "#1e3a5f",
      },
      handler: () => {
        // Payment successful — navigate to confirmation
        navigate({
          to: "/confirmation",
          search: {
            pnr,
            from,
            to,
            airline,
            flightNumber,
            total: String(total),
            departure,
            arrival,
            phone,
            depart,
            returnDate,
          },
        });
      },
      modal: {
        ondismiss: () => {
          setIsPaying(false);
          toast.info("Payment cancelled.");
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", () => {
      setIsPaying(false);
      toast.error("Payment failed. Please try again.");
    });
    rzp.open();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-10 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-navy-DEFAULT flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-navy-DEFAULT">
                Secure Payment
              </h1>
              <p className="text-sm text-muted-foreground">
                Powered by Razorpay — 256-bit SSL encrypted
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Pay button card */}
            <div className="lg:col-span-3 flex flex-col gap-6">
              <Card data-ocid="payment.panel">
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center gap-6">
                  {/* Razorpay logo row */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2 text-2xl font-extrabold text-navy-DEFAULT">
                      Pay with
                      <span className="text-[#528FF0] font-black">
                        Razorpay
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Supports UPI, Debit &amp; Credit Cards, Net Banking, and
                      Wallets — all in one secure popup.
                    </p>
                  </div>

                  {/* Accepted methods icons */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {["UPI", "Cards", "Net Banking", "Wallets", "EMI"].map(
                      (m) => (
                        <span
                          key={m}
                          className="bg-muted text-xs font-semibold px-3 py-1.5 rounded-full text-navy-DEFAULT"
                        >
                          {m}
                        </span>
                      ),
                    )}
                  </div>

                  <Separator className="w-full" />

                  <Button
                    onClick={handlePay}
                    disabled={isPaying || !scriptLoaded}
                    className="w-full h-14 text-lg font-extrabold bg-orange-DEFAULT hover:bg-orange-dark text-white rounded-xl shadow-lg"
                    data-ocid="payment.pay.button"
                  >
                    {isPaying ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Opening Payment...
                      </>
                    ) : !scriptLoaded ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                        Loading Gateway...
                      </>
                    ) : (
                      <>
                        Pay ₹{total > 0 ? total.toLocaleString("en-IN") : "--"}
                      </>
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    A secure Razorpay popup will open. Complete payment there.
                  </p>
                </CardContent>
              </Card>

              {/* Security badge */}
              <div className="bg-green-50 border border-green-100 rounded-lg px-4 py-3 flex items-start gap-3">
                <Lock className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                <p className="text-xs text-green-700">
                  Your payment is processed securely by Razorpay. SkyBook India
                  never stores your card or bank details.
                </p>
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <Card
                  className="sticky top-4"
                  data-ocid="payment.summary.panel"
                >
                  <div className="bg-navy-DEFAULT rounded-t-lg px-5 py-4">
                    <h3 className="text-white font-bold text-lg">
                      Order Summary
                    </h3>
                    <p className="text-white/60 text-xs mt-1">PNR: {pnr}</p>
                  </div>
                  <CardContent className="pt-5 space-y-4">
                    {/* Route */}
                    <div className="flex items-center justify-center gap-3 py-2">
                      <div className="text-center">
                        <p className="text-xl font-extrabold text-navy-DEFAULT">
                          {from}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(departure)}
                        </p>
                      </div>
                      <div className="flex flex-col items-center gap-1">
                        <ArrowRight className="w-5 h-5 text-orange-DEFAULT" />
                        <span className="text-[10px] text-muted-foreground">
                          {airline}
                        </span>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-extrabold text-navy-DEFAULT">
                          {to}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTime(arrival)}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2.5">
                      {depart && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Date</span>
                          <span className="font-semibold">
                            {formatDate(depart)}
                          </span>
                        </div>
                      )}
                      {returnDate && (
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Return Date
                          </span>
                          <span className="font-semibold">
                            {formatDate(returnDate)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Flight</span>
                        <span className="font-semibold text-navy-DEFAULT">
                          {flightNumber}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Class</span>
                        <span className="font-semibold capitalize">
                          {classType}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Passengers
                        </span>
                        <span className="font-semibold">{passengersCount}</span>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2.5">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Base Fare ({passengersCount} pax)
                        </span>
                        <span className="font-semibold">
                          ₹
                          {fareTotal > 0
                            ? fareTotal.toLocaleString("en-IN")
                            : "--"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Convenience Fee
                        </span>
                        <span className="font-semibold">
                          ₹{CONVENIENCE_FEE.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-between items-center">
                      <span className="font-bold text-navy-DEFAULT">Total</span>
                      <span className="text-3xl font-extrabold text-orange-DEFAULT">
                        ₹{total > 0 ? total.toLocaleString("en-IN") : "--"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
