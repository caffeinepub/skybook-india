import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Filter, Plane, SortAsc } from "lucide-react";
import { motion } from "motion/react";
import { useMemo, useState } from "react";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const ALL_AIRLINES = [
  { name: "IndiGo", prefix: "6E" },
  { name: "Air India", prefix: "AI" },
  { name: "SpiceJet", prefix: "SG" },
  { name: "Vistara", prefix: "UK" },
  { name: "Akasa Air", prefix: "QP" },
  { name: "Star Air", prefix: "S5" },
  { name: "Alliance Air", prefix: "9I" },
  { name: "Blue Dart", prefix: "BZ" },
];

// Map airline name -> prefix for flight number generation
const AIRLINE_PREFIX: Record<string, string> = Object.fromEntries(
  ALL_AIRLINES.map((a) => [a.name, a.prefix]),
);

// Route-specific airline rules.
// Keys are "ORIGIN_CODE|DEST_CODE" using city name (lowercase, trimmed).
// If a route is listed here, ONLY those airlines are used.
// Normalise by sorting origin/dest alphabetically so reverse routes match too.
const ROUTE_AIRLINE_MAP: Record<string, string[]> = {
  // Kolkata ↔ Purnia: only Star Air and IndiGo
  "kolkata|purnia": ["Star Air", "IndiGo"],
  // Patna ↔ Purnia: only Star Air
  "patna|purnia": ["Star Air"],
  // Small regional routes served only by Star Air / Alliance Air
  "kolkata|agartala": ["IndiGo", "Air India", "SpiceJet"],
  "kolkata|guwahati": ["IndiGo", "Air India", "SpiceJet", "Akasa Air"],
  // Default for most routes – populated dynamically below
};

// Default pool for major routes
const DEFAULT_AIRLINES = ["IndiGo", "Air India", "SpiceJet", "Akasa Air"];

function normaliseKey(a: string, b: string): string {
  const clean = (s: string) =>
    s.trim().toLowerCase().split(" (")?.[0] ?? s.trim().toLowerCase();
  const ca = clean(a);
  const cb = clean(b);
  return [ca, cb].sort().join("|");
}

function getAirlinesForRoute(from: string, to: string): string[] {
  const key = normaliseKey(from, to);
  return ROUTE_AIRLINE_MAP[key] ?? DEFAULT_AIRLINES;
}

interface Flight {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: number;
  arrivalTime: number;
  price: number;
  classType: string;
}

function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0;
  return h;
}

// Realistic per-route price ranges based on typical Indian domestic fares
function getBasePrice(from: string, to: string): number {
  const key = normaliseKey(from, to);
  const PRICE_MAP: Record<string, number> = {
    "kolkata|purnia": 3200,
    "patna|purnia": 2800,
    "chennai|mumbai": 4500,
    "delhi|mumbai": 4800,
    "bengaluru|delhi": 5200,
    "bengaluru|mumbai": 3800,
    "hyderabad|mumbai": 4200,
    "kolkata|delhi": 5000,
    "kolkata|mumbai": 5500,
    "kolkata|bengaluru": 5300,
    "delhi|guwahati": 5800,
    "kolkata|guwahati": 4200,
  };
  if (PRICE_MAP[key]) return PRICE_MAP[key];
  // Fallback: deterministic from city names
  const seed = strHash(key);
  return 3500 + (seed % 50) * 100;
}

function generateFlights(
  from: string,
  to: string,
  depart: string,
  classType: string,
): Flight[] {
  if (!from || !to || !depart) return [];

  const parts = depart.split("-").map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) return [];
  const baseDate = new Date(parts[0], parts[1] - 1, parts[2]);
  baseDate.setHours(0, 0, 0, 0);

  const routeAirlines = getAirlinesForRoute(from, to);
  const seed = strHash(normaliseKey(from, to));
  const basePriceEconomy = getBasePrice(from, to);
  const basePriceBusiness = Math.round(basePriceEconomy * 2.6);

  // Duration: 70–180 mins depending on route seed
  const flightDurationMins = 70 + (seed % 12) * 10;

  // Spread departures across the day – two slots per airline
  const allSlots = [6, 8, 10, 12, 14, 16, 18, 20];
  const flights: Flight[] = [];

  routeAirlines.forEach((airlineName, idx) => {
    const prefix = AIRLINE_PREFIX[airlineName] ?? "XX";
    const flightSeed = strHash(airlineName + normaliseKey(from, to));

    // 1–2 timeslots per airline
    const numSlots = routeAirlines.length === 1 ? 2 : 1;
    for (let s = 0; s < numSlots; s++) {
      const slotIdx = (idx * 2 + s) % allSlots.length;
      const hour = allSlots[slotIdx];
      const minuteOffset = (flightSeed + s * 13) % 50;

      const depTime = new Date(baseDate);
      depTime.setHours(hour, minuteOffset, 0, 0);
      const arrTime = new Date(depTime.getTime() + flightDurationMins * 60000);

      const isBusinessFlight = classType === "business";
      const currClass = isBusinessFlight ? "business" : "economy";

      if (classType !== "all" && classType !== currClass) continue;

      const basePrice =
        currClass === "business" ? basePriceBusiness : basePriceEconomy;
      const variation = ((flightSeed + s * 17) % 10) * 100; // ₹0–₹900 variation
      const rawPrice = basePrice + variation;
      const price =
        Number.isFinite(rawPrice) && rawPrice > 0 ? Math.round(rawPrice) : 3999;

      const flightNum = `${prefix}-${100 + idx * 11 + (flightSeed % 50)}`;

      flights.push({
        flightNumber: flightNum,
        airline: airlineName,
        origin: from,
        destination: to,
        departureTime: depTime.getTime(),
        arrivalTime: arrTime.getTime(),
        price,
        classType: currClass,
      });
    }
  });

  return flights;
}

function formatTime(ms: number): string {
  if (!ms || !Number.isFinite(ms)) return "--:--";
  return new Date(ms).toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatDuration(dep: number, arr: number): string {
  const mins = Math.round((arr - dep) / 60000);
  if (!Number.isFinite(mins) || mins <= 0) return "--";
  return `${Math.floor(mins / 60)}h ${mins % 60}m`;
}

function formatPrice(price: number): string {
  if (!Number.isFinite(price) || price <= 0) return "₹3,999";
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function SearchPage() {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const [sortBy, setSortBy] = useState<"price" | "duration">("price");
  const [filterAirline, setFilterAirline] = useState("all");

  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const depart = params.get("depart") || "";
  const passengers = Math.max(1, Number(params.get("passengers") || "1"));
  const classType = (params.get("class") || "economy") as
    | "economy"
    | "business";

  const rawFlights = useMemo(
    () => generateFlights(from, to, depart, classType),
    [from, to, depart, classType],
  );

  const airlines = useMemo(
    () => Array.from(new Set(rawFlights.map((f) => f.airline))) as string[],
    [rawFlights],
  );

  const flights = useMemo(() => {
    let result = [...rawFlights];
    if (filterAirline !== "all")
      result = result.filter((f) => f.airline === filterAirline);
    if (sortBy === "price") {
      result.sort((a, b) => a.price - b.price);
    } else {
      result.sort(
        (a, b) =>
          a.arrivalTime - a.departureTime - (b.arrivalTime - b.departureTime),
      );
    }
    return result;
  }, [rawFlights, sortBy, filterAirline]);

  const handleSelectFlight = (flight: Flight) => {
    navigate({
      to: "/book",
      search: {
        flightNumber: flight.flightNumber,
        airline: flight.airline,
        from: flight.origin,
        to: flight.destination,
        departure: String(flight.departureTime),
        arrival: String(flight.arrivalTime),
        price: String(flight.price),
        passengers: String(passengers),
        classType: flight.classType,
        depart: depart,
        returnDate: params.get("return") || "",
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      {/* Search summary bar */}
      <div className="bg-navy-DEFAULT text-white py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Plane className="w-5 h-5" />
            <span>{from}</span>
            <ArrowRight className="w-4 h-4 text-orange-DEFAULT" />
            <span>{to}</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span>
              {depart
                ? (() => {
                    const [y, m, d] = depart.split("-").map(Number);
                    return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    });
                  })()
                : ""}
            </span>
            <span>·</span>
            <span>
              {passengers} {passengers === 1 ? "Passenger" : "Passengers"}
            </span>
            <span>·</span>
            <span className="capitalize">{classType}</span>
          </div>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="ml-auto text-sm text-orange-DEFAULT hover:text-orange-light font-medium"
            data-ocid="search.modify.button"
          >
            Modify Search
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full">
        {/* Filters & Sort */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Airline:</span>
            <Select value={filterAirline} onValueChange={setFilterAirline}>
              <SelectTrigger
                className="h-9 w-40"
                data-ocid="search.airline.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Airlines</SelectItem>
                {airlines.map((a) => (
                  <SelectItem key={a} value={a}>
                    {a}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <SortAsc className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as "price" | "duration")}
            >
              <SelectTrigger
                className="h-9 w-36"
                data-ocid="search.sort.select"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Price</SelectItem>
                <SelectItem value="duration">Duration</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {flights.length} flight{flights.length !== 1 ? "s" : ""} found
          </div>
        </div>

        {flights.length === 0 ? (
          <div className="text-center py-20" data-ocid="search.empty_state">
            <Plane className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-bold text-navy-DEFAULT mb-2">
              No flights found
            </h3>
            <p className="text-muted-foreground mb-6">
              Try different dates or cities.
            </p>
            <Button
              onClick={() => navigate({ to: "/" })}
              data-ocid="search.back.button"
            >
              Search Again
            </Button>
          </div>
        ) : (
          <div className="space-y-4" data-ocid="search.list">
            {flights.map((flight, i) => (
              <motion.div
                key={`${flight.flightNumber}-${i}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-border shadow-xs hover:shadow-md transition-all p-5"
                data-ocid={`search.item.${i + 1}`}
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="w-36">
                    <p className="font-bold text-navy-DEFAULT">
                      {flight.airline}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flight.flightNumber}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-xs mt-1 capitalize"
                    >
                      {flight.classType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 flex-1">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-navy-DEFAULT">
                        {formatTime(flight.departureTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.origin}
                      </p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(
                          flight.departureTime,
                          flight.arrivalTime,
                        )}
                      </p>
                      <div className="w-full flex items-center gap-1">
                        <div className="flex-1 h-px bg-border" />
                        <Plane className="w-4 h-4 text-orange-DEFAULT rotate-90" />
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <p className="text-xs text-green-600 font-medium">
                        Non-stop
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-navy-DEFAULT">
                        {formatTime(flight.arrivalTime)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {flight.destination}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-extrabold text-orange-DEFAULT">
                      {formatPrice(flight.price)}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      per person
                    </p>
                    <Button
                      onClick={() => handleSelectFlight(flight)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6"
                      data-ocid={`search.select.button.${i + 1}`}
                    >
                      Select
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
