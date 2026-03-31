import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle, Loader2, Phone, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const CONVENIENCE_FEE = 385;

interface PassengerForm {
  id: string;
  name: string;
  age: string;
  gender: string;
  phone: string;
}

const makePassenger = (seq: number): PassengerForm => ({
  id: `pax-${seq}`,
  name: "",
  age: "",
  gender: "",
  phone: "",
});

function safeNum(val: string | null, fallback = 0): number {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
}

export default function BookingPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);

  const flightNumber = params.get("flightNumber") || "";
  const airline = params.get("airline") || "";
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const departure = params.get("departure") || "";
  const arrival = params.get("arrival") || "";
  const pricePerPax = safeNum(params.get("price"), 3999);
  const passengersCount = Math.max(1, safeNum(params.get("passengers"), 1));
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

  const [contactPhone, setContactPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passengers, setPassengers] = useState<PassengerForm[]>(
    Array.from({ length: passengersCount }, (_, i) => makePassenger(i + 1)),
  );

  const updatePassenger = (
    id: string,
    field: keyof PassengerForm,
    value: string,
  ) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const fareTotal = pricePerPax * passengersCount;
  const totalAmount = fareTotal + CONVENIENCE_FEE;

  const formatTime = (ms: string) => {
    if (!ms) return "--:--";
    const n = Number(ms);
    if (!Number.isFinite(n)) return "--:--";
    return new Date(n).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleConfirm = async () => {
    for (const [i, p] of passengers.entries()) {
      if (!p.name || !p.age || !p.gender || !p.phone) {
        toast.error(`Please fill all details for Passenger ${i + 1}`);
        return;
      }
    }
    if (!contactPhone || contactPhone.replace(/\D/g, "").length < 10) {
      toast.error("Please enter a valid 10-digit contact phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      const pnr = `SKY${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      navigate({
        to: "/payment",
        search: {
          pnr,
          from,
          to,
          airline,
          flightNumber,
          total: String(totalAmount),
          departure,
          arrival,
          phone: contactPhone,
          passengersCount: String(passengersCount),
          pricePerPax: String(pricePerPax),
          classType,
          depart,
          returnDate,
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-navy-DEFAULT mb-8">
          Complete Your Booking
        </h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {passengers.map((pax, i) => (
              <motion.div
                key={pax.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card data-ocid={`booking.passenger.${i + 1}`}>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-navy-DEFAULT">
                      <User className="w-5 h-5" />
                      Passenger {i + 1}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                        Full Name *
                      </Label>
                      <Input
                        placeholder="e.g. Rahul Sharma"
                        value={pax.name}
                        onChange={(e) =>
                          updatePassenger(pax.id, "name", e.target.value)
                        }
                        data-ocid={`booking.name.input.${i + 1}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                        Age *
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        max="120"
                        placeholder="e.g. 28"
                        value={pax.age}
                        onChange={(e) =>
                          updatePassenger(pax.id, "age", e.target.value)
                        }
                        data-ocid={`booking.age.input.${i + 1}`}
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                        Gender *
                      </Label>
                      <Select
                        value={pax.gender}
                        onValueChange={(v) =>
                          updatePassenger(pax.id, "gender", v)
                        }
                      >
                        <SelectTrigger
                          data-ocid={`booking.gender.select.${i + 1}`}
                        >
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                        Mobile Number *
                      </Label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={pax.phone}
                        onChange={(e) =>
                          updatePassenger(pax.id, "phone", e.target.value)
                        }
                        data-ocid={`booking.phone.input.${i + 1}`}
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}

            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-navy-DEFAULT text-base">
                  <Phone className="w-5 h-5" />
                  Contact Phone Number
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                  Your calling number for booking updates *
                </Label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  data-ocid="booking.contact_phone.input"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  We will send booking confirmation SMS to this number.
                </p>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4" data-ocid="booking.summary.panel">
              <div className="bg-navy-medium rounded-t-lg px-5 py-3">
                <h3 className="text-white font-bold">Flight Summary</h3>
              </div>
              <CardContent className="pt-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Flight</span>
                  <span className="font-semibold text-navy-DEFAULT">
                    {flightNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Airline</span>
                  <span className="font-semibold">{airline}</span>
                </div>
                <div className="flex items-center gap-2 justify-between">
                  <span className="text-sm text-muted-foreground">Route</span>
                  <span className="font-semibold flex items-center gap-1">
                    {from}{" "}
                    <ArrowRight className="w-3 h-3 text-orange-DEFAULT" /> {to}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Departure
                  </span>
                  <span className="font-semibold">{formatTime(departure)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Arrival</span>
                  <span className="font-semibold">{formatTime(arrival)}</span>
                </div>
                {depart && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="font-semibold">{formatDate(depart)}</span>
                  </div>
                )}
                {returnDate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Return Date
                    </span>
                    <span className="font-semibold">
                      {formatDate(returnDate)}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Class</span>
                  <span className="font-semibold capitalize">{classType}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Passengers
                  </span>
                  <span className="font-semibold">{passengersCount}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Fare ({passengersCount}{" "}
                    {passengersCount === 1 ? "pax" : "pax"})
                  </span>
                  <span className="font-semibold">
                    ₹{fareTotal.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Convenience Fee
                  </span>
                  <span className="font-semibold">
                    ₹{CONVENIENCE_FEE.toLocaleString("en-IN")}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="font-bold text-navy-DEFAULT">
                    Total Amount
                  </span>
                  <span className="text-2xl font-extrabold text-orange-DEFAULT">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <Button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="w-full bg-orange-DEFAULT hover:bg-orange-dark text-white font-bold h-12 mt-2"
                  data-ocid="booking.confirm.button"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Proceed to Payment
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
