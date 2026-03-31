import { Link } from "@tanstack/react-router";
import {
  CreditCard,
  HeadphonesIcon,
  Luggage,
  Search,
  Shield,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import BookingForm from "../components/BookingForm";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const POPULAR_ROUTES = [
  { from: "Delhi", to: "Mumbai", duration: "2h 05m" },
  { from: "Mumbai", to: "Bangalore", duration: "1h 40m" },
  { from: "Delhi", to: "Goa", duration: "2h 35m" },
  { from: "Hyderabad", to: "Chennai", duration: "1h 20m" },
  { from: "Kolkata", to: "Delhi", duration: "2h 25m" },
  { from: "Mumbai", to: "Kochi", duration: "2h 00m" },
  { from: "Bangalore", to: "Hyderabad", duration: "1h 10m" },
  { from: "Delhi", to: "Jaipur", duration: "1h 05m" },
];

const WHY_BOOK = [
  {
    icon: Shield,
    title: "Secure Booking",
    desc: "Your payments and data are protected with bank-grade security.",
  },
  {
    icon: Zap,
    title: "Instant Confirmation",
    desc: "Get your e-ticket and PNR instantly after booking.",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Support",
    desc: "Round-the-clock customer support for all your travel needs.",
  },
  {
    icon: Shield,
    title: "Trusted Platform",
    desc: "Thousands of passengers book with SkyBook India every day.",
  },
];

const HOW_IT_WORKS = [
  {
    icon: Search,
    step: "01",
    title: "Search Flights",
    desc: "Enter your origin, destination, and travel date.",
  },
  {
    icon: Shield,
    step: "02",
    title: "Select Fare",
    desc: "Compare fares and pick Economy or Business class.",
  },
  {
    icon: Luggage,
    step: "03",
    title: "Passenger Details",
    desc: "Fill in traveller info quickly and accurately.",
  },
  {
    icon: CreditCard,
    step: "04",
    title: "Secure Payment",
    desc: "Pay safely in ₹ and receive your e-ticket instantly.",
  },
];

export default function HomePage() {
  const departDate = new Date(Date.now() + 86400000 * 3)
    .toISOString()
    .split("T")[0];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[600px] flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-india-flights.dim_1600x700.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-DEFAULT/80 via-navy-DEFAULT/50 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-orange-DEFAULT font-semibold text-sm uppercase tracking-widest mb-3">
                Domestic Flights · India Only · All Prices in ₹
              </p>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                Explore India
                <br />
                <span className="text-orange-DEFAULT">Together.</span>
              </h1>
              <p className="text-white/80 text-lg leading-relaxed max-w-md">
                Book domestic flights across India effortlessly. Over 60
                airports, all major airlines, instant confirmation.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <BookingForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Routes */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-navy-DEFAULT mb-2">
              Popular Routes
            </h2>
            <p className="text-muted-foreground mb-8">
              Top domestic routes across India
            </p>
          </motion.div>

          <div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            data-ocid="routes.list"
          >
            {POPULAR_ROUTES.map((route, i) => (
              <motion.div
                key={`${route.from}-${route.to}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                data-ocid={`routes.item.${i + 1}`}
              >
                <Link
                  to="/search"
                  search={{
                    from: route.from,
                    to: route.to,
                    depart: departDate,
                    passengers: "1",
                    class: "economy",
                  }}
                  className="block p-5 rounded-xl border border-border hover:border-orange-DEFAULT hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-2 text-navy-DEFAULT font-bold text-lg mb-1">
                    <span>{route.from}</span>
                    <span className="text-orange-DEFAULT text-sm">→</span>
                    <span>{route.to}</span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {route.duration} · Non-stop
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Book With SkyBook */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-DEFAULT mb-2">
              Why Book With SkyBook?
            </h2>
            <p className="text-muted-foreground">
              India's most trusted domestic flight platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_BOOK.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="text-center p-6 bg-white rounded-2xl border border-border shadow-xs"
              >
                <div className="w-14 h-14 rounded-2xl bg-navy-DEFAULT/5 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-7 h-7 text-navy-DEFAULT" />
                </div>
                <h3 className="font-bold text-navy-DEFAULT mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-navy-DEFAULT mb-2">
              Seamless Booking Process
            </h2>
            <p className="text-muted-foreground">
              Book your flight in just 4 easy steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="relative text-center"
              >
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden lg:block absolute top-7 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px border-t-2 border-dashed border-border" />
                )}
                <div className="relative w-16 h-16 rounded-2xl bg-navy-DEFAULT flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-white" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-orange-DEFAULT text-white text-xs font-bold flex items-center justify-center">
                    {item.step}
                  </span>
                </div>
                <h3 className="font-bold text-navy-DEFAULT mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1" />
      <Footer />
    </div>
  );
}
