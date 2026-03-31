import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  Calendar,
  Plane,
  Search,
  Users,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

export const INDIAN_AIRPORTS = [
  "Agartala",
  "Agra",
  "Ahmedabad",
  "Aizawl",
  "Ajmer",
  "Akola",
  "Aligarh",
  "Allahabad (Prayagraj)",
  "Alwar",
  "Ambikapur",
  "Amritsar",
  "Araria",
  "Arrah",
  "Arwal",
  "Aurangabad (Bihar)",
  "Aurangabad (Maharashtra)",
  "Bagaha",
  "Bagdogra",
  "Banka",
  "Bareilly",
  "Barmer",
  "Bathinda",
  "Begusarai",
  "Belgaum",
  "Bengaluru",
  "Bhagalpur",
  "Bharatpur",
  "Bhopal",
  "Bhubaneswar",
  "Bhuj",
  "Bikaner",
  "Bilaspur",
  "Bodhgaya",
  "Bokaro",
  "Buxar",
  "Calicut (Kozhikode)",
  "Chandigarh",
  "Chennai",
  "Chhapra",
  "Chinyalisaur",
  "Chitrakoot",
  "Churu",
  "Coimbatore",
  "Darbhanga",
  "Dehra Dun",
  "Deoghar",
  "Dhanbad",
  "Dharamshala (Kangra)",
  "Dibrugarh",
  "Dimapur",
  "Diu",
  "Forbesganj",
  "Ganganagar",
  "Gauchar",
  "Gaya",
  "Goa (Dabolim)",
  "Goa (Mopa)",
  "Gopalganj",
  "Gorakhpur",
  "Gulbarga",
  "Guwahati",
  "Gwalior",
  "Hajipur",
  "Haldwani",
  "Hanumangarh",
  "Haridwar",
  "Hubli",
  "Hyderabad",
  "Imphal",
  "Indore",
  "Itanagar",
  "Jabalpur",
  "Jagdalpur",
  "Jaipur",
  "Jaisalmer",
  "Jalandhar",
  "Jammu",
  "Jamui",
  "Jamshedpur",
  "Jehanabad",
  "Jodhpur",
  "Jorhat",
  "Kadapa",
  "Kaimur",
  "Kalaburagi",
  "Kannur",
  "Kanpur",
  "Kashipur",
  "Katihar",
  "Khagaria",
  "Kishanganj",
  "Kochi",
  "Kohima",
  "Kolkata",
  "Koraput",
  "Korba",
  "Kota",
  "Kullu (Bhuntar)",
  "Leh",
  "Lilabari",
  "Lucknow",
  "Ludhiana",
  "Madurai",
  "Madhepura",
  "Madhubani",
  "Mandi",
  "Mangalore",
  "Mathura",
  "Meerut",
  "Moradabad",
  "Motihari",
  "Mumbai",
  "Munger",
  "Mussoorie",
  "Muzaffarnagar",
  "Muzaffarpur",
  "Mysuru",
  "Nagpur",
  "Nalanda",
  "Nanded",
  "Naini Tal",
  "Nawada",
  "New Delhi",
  "Pantnagar",
  "Pathankot",
  "Patna",
  "Pithoragarh",
  "Port Blair",
  "Prayagraj",
  "Pune",
  "Purnia",
  "Raebareli",
  "Raigarh",
  "Raipur",
  "Rajahmundry",
  "Rajgir",
  "Rampur",
  "Ranchi",
  "Raxaul",
  "Rewa",
  "Rishikesh",
  "Rohtas",
  "Roorkee",
  "Rourkela",
  "Saharanpur",
  "Saharsa",
  "Salem",
  "Sambalpur",
  "Samastipur",
  "Saran (Chapra)",
  "Sasaram",
  "Satna",
  "Sheohar",
  "Shimla",
  "Shillong",
  "Sikar",
  "Silchar",
  "Sitamarhi",
  "Siwan",
  "Solan",
  "Srinagar",
  "Surat",
  "Supaul",
  "Tezpur",
  "Tiruchirappalli",
  "Tirupati",
  "Trivandrum",
  "Tura",
  "Udaipur",
  "Vadodara",
  "Vaishali",
  "Varanasi",
  "Vijayawada",
  "Visakhapatnam",
  "Wardha",
].sort();

interface AirportInputProps {
  value: string;
  onChange: (val: string) => void;
  exclude?: string;
  placeholder?: string;
  id?: string;
}

function AirportInput({
  value,
  onChange,
  exclude,
  placeholder,
  id,
}: AirportInputProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = INDIAN_AIRPORTS.filter(
    (city) =>
      city !== exclude &&
      city.toLowerCase().includes(query.toLowerCase()) &&
      query.length > 0,
  ).slice(0, 8);

  const handleSelect = (city: string) => {
    setQuery(city);
    onChange(city);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange("");
    setOpen(true);
  };

  const handleClear = () => {
    setQuery("");
    onChange("");
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          id={id}
          value={query}
          onChange={handleChange}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          placeholder={placeholder || "Type city name..."}
          className={`h-12 pl-10 pr-8 ${value ? "bg-yellow-100 border-yellow-400" : ""}`}
          autoComplete="off"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 bg-white border border-border rounded-lg shadow-lg mt-1 max-h-52 overflow-y-auto">
          {suggestions.map((city) => (
            <button
              key={city}
              type="button"
              onMouseDown={() => handleSelect(city)}
              className="w-full text-left px-4 py-2.5 text-sm hover:bg-yellow-50 hover:text-navy-DEFAULT transition-colors"
            >
              {city}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function BookingForm() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<"one-way" | "round-trip">("one-way");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [depart, setDepart] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [flightClass, setFlightClass] = useState("economy");

  const handleSwap = () => {
    setFrom(to);
    setTo(from);
  };

  const handleSearch = () => {
    if (!from || !to || !depart) return;
    navigate({
      to: "/search",
      search: {
        from,
        to,
        depart,
        passengers,
        class: flightClass,
        tripType,
        ...(tripType === "round-trip" && returnDate
          ? { return: returnDate }
          : {}),
      },
    });
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-booking">
      <div className="bg-navy-medium px-6 py-4">
        <div className="flex items-center gap-2 text-white">
          <Plane className="w-5 h-5" />
          <h2 className="font-bold text-lg">Book Your Domestic Flight</h2>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Trip type toggle */}
        <div
          className="flex gap-1 bg-secondary rounded-lg p-1"
          data-ocid="booking.trip_type.toggle"
        >
          {(["one-way", "round-trip"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTripType(type)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                tripType === type
                  ? "bg-navy-DEFAULT text-white shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              data-ocid={`booking.${type}.toggle`}
            >
              {type === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>

        {/* From / To */}
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              From
            </Label>
            <AirportInput
              value={from}
              onChange={setFrom}
              exclude={to}
              placeholder="Type city name..."
              id="booking-from"
            />
          </div>

          <button
            type="button"
            onClick={handleSwap}
            className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-full border-2 border-border hover:border-orange-DEFAULT hover:text-orange-DEFAULT transition-colors mb-0"
            data-ocid="booking.swap.button"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              To
            </Label>
            <AirportInput
              value={to}
              onChange={setTo}
              exclude={from}
              placeholder="Type city name..."
              id="booking-to"
            />
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Depart
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                min={today}
                value={depart}
                onChange={(e) => setDepart(e.target.value)}
                className={`h-12 pl-10 ${depart ? "bg-yellow-100 border-yellow-400" : ""}`}
                data-ocid="booking.depart.input"
              />
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Return
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <Input
                type="date"
                min={depart || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={tripType === "one-way"}
                className={`h-12 pl-10 disabled:opacity-40 ${returnDate && tripType === "round-trip" ? "bg-yellow-100 border-yellow-400" : ""}`}
                data-ocid="booking.return.input"
              />
            </div>
          </div>
        </div>

        {/* Passengers & Class */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Passengers
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none z-10" />
              <Select value={passengers} onValueChange={setPassengers}>
                <SelectTrigger
                  className="h-12 pl-10"
                  data-ocid="booking.passengers.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} {n === 1 ? "Adult" : "Adults"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
              Class
            </Label>
            <Select value={flightClass} onValueChange={setFlightClass}>
              <SelectTrigger className="h-12" data-ocid="booking.class.select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="economy">Economy</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button
          onClick={handleSearch}
          disabled={!from || !to || !depart}
          className="w-full text-base font-bold bg-orange-DEFAULT hover:bg-orange-dark text-white rounded-xl shadow-md hover:shadow-lg transition-all py-6"
          data-ocid="booking.search.button"
        >
          <Search className="w-5 h-5 mr-2" />
          Search Flights
        </Button>
      </div>
    </div>
  );
}
