import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Calendar, Plane, Search, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { Booking } from "../backend.d";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { useGetBookingByPNR, useGetBookingsByEmail } from "../hooks/useQueries";

function BookingCard({ booking, index }: { booking: Booking; index: number }) {
  const formatTime = (ms: bigint) =>
    new Date(Number(ms)).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  const formatDate = (ms: bigint) =>
    new Date(Number(ms)).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-white rounded-2xl border border-border shadow-xs p-5"
      data-ocid={`bookings.item.${index + 1}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 text-navy-DEFAULT font-bold text-lg">
            <span>{booking.flight.origin}</span>
            <ArrowRight className="w-4 h-4 text-orange-DEFAULT" />
            <span>{booking.flight.destination}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {booking.flight.airline} · {booking.flight.flightNumber}
          </p>
        </div>
        <div className="text-right">
          <Badge className="bg-green-100 text-green-700 border-green-200 mb-1">
            Confirmed
          </Badge>
          <p className="text-xs text-muted-foreground">
            PNR:{" "}
            <span className="font-bold text-navy-DEFAULT">{booking.pnr}</span>
          </p>
        </div>
      </div>
      <Separator className="mb-4" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex items-center gap-2">
          <Plane className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Departure</p>
            <p className="font-semibold text-sm">
              {formatTime(booking.flight.departureTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Date</p>
            <p className="font-semibold text-sm">
              {formatDate(booking.flight.departureTime)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">Passengers</p>
            <p className="font-semibold text-sm">{booking.passengers.length}</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Total Paid</p>
          <p className="text-xl font-extrabold text-orange-DEFAULT">
            ₹{Number(booking.totalAmount).toLocaleString("en-IN")}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyBookingsPage() {
  const [emailInput, setEmailInput] = useState("");
  const [pnrInput, setPnrInput] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchPnr, setSearchPnr] = useState("");

  const { data: emailBookings, isLoading: emailLoading } =
    useGetBookingsByEmail(searchEmail);
  const { data: pnrBooking, isLoading: pnrLoading } =
    useGetBookingByPNR(searchPnr);

  const pnrBookings: Booking[] = pnrBooking ? [pnrBooking] : [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-8 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-navy-DEFAULT mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground mb-8">
            Search your bookings by email address or PNR number
          </p>
        </motion.div>

        <Tabs defaultValue="email" data-ocid="bookings.search.tab">
          <TabsList className="mb-6">
            <TabsTrigger value="email" data-ocid="bookings.email.tab">
              Search by Email
            </TabsTrigger>
            <TabsTrigger value="pnr" data-ocid="bookings.pnr.tab">
              Search by PNR
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <Card className="mb-6">
              <CardContent className="pt-5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                  Email Address
                </Label>
                <div className="flex gap-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSearchEmail(emailInput)
                    }
                    className="flex-1"
                    data-ocid="bookings.email.input"
                  />
                  <Button
                    onClick={() => setSearchEmail(emailInput)}
                    className="bg-navy-DEFAULT hover:bg-navy-medium text-white"
                    data-ocid="bookings.email.search.button"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {emailLoading && searchEmail && (
              <div className="space-y-4" data-ocid="bookings.loading_state">
                {[1, 2].map((n) => (
                  <Skeleton key={n} className="h-36 w-full rounded-xl" />
                ))}
              </div>
            )}

            {!emailLoading &&
              searchEmail &&
              emailBookings &&
              emailBookings.length > 0 && (
                <div className="space-y-4" data-ocid="bookings.list">
                  {emailBookings.map((b, i) => (
                    <BookingCard key={b.pnr} booking={b} index={i} />
                  ))}
                </div>
              )}

            {!emailLoading &&
              searchEmail &&
              (!emailBookings || emailBookings.length === 0) && (
                <div
                  className="text-center py-16 bg-white rounded-2xl border border-border"
                  data-ocid="bookings.empty_state"
                >
                  <Plane className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-navy-DEFAULT mb-2">
                    No bookings found
                  </h3>
                  <p className="text-muted-foreground">
                    No bookings found for{" "}
                    <span className="font-medium">{searchEmail}</span>
                  </p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="pnr">
            <Card className="mb-6">
              <CardContent className="pt-5">
                <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1.5 block">
                  PNR / Booking Reference
                </Label>
                <div className="flex gap-3">
                  <Input
                    placeholder="e.g. SKY4A7X2B"
                    value={pnrInput}
                    onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
                    onKeyDown={(e) =>
                      e.key === "Enter" && setSearchPnr(pnrInput)
                    }
                    className="flex-1 font-mono tracking-widest"
                    data-ocid="bookings.pnr.input"
                  />
                  <Button
                    onClick={() => setSearchPnr(pnrInput)}
                    className="bg-navy-DEFAULT hover:bg-navy-medium text-white"
                    data-ocid="bookings.pnr.search.button"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {pnrLoading && searchPnr && (
              <Skeleton
                className="h-36 w-full rounded-xl"
                data-ocid="bookings.pnr.loading_state"
              />
            )}

            {!pnrLoading && searchPnr && pnrBookings.length > 0 && (
              <div className="space-y-4">
                {pnrBookings.map((b, i) => (
                  <BookingCard key={b.pnr} booking={b} index={i} />
                ))}
              </div>
            )}

            {!pnrLoading && searchPnr && pnrBookings.length === 0 && (
              <div
                className="text-center py-16 bg-white rounded-2xl border border-border"
                data-ocid="bookings.pnr.empty_state"
              >
                <Plane className="w-14 h-14 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-bold text-navy-DEFAULT mb-2">
                  Booking not found
                </h3>
                <p className="text-muted-foreground">
                  No booking found with PNR{" "}
                  <span className="font-mono font-bold">{searchPnr}</span>
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
