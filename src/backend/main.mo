import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Nat "mo:core/Nat";
import List "mo:core/List";

actor {
  type Gender = { #male; #female; #other };

  type Passenger = {
    name : Text;
    age : Nat;
    gender : Gender;
    phone : Text;
    email : Text;
  };

  type FlightClass = { #economy; #business };

  type Flight = {
    flightNumber : Text;
    airline : Text;
    origin : Text;
    destination : Text;
    departureTime : Int; // Timestamp in seconds
    arrivalTime : Int; // Timestamp in seconds
    price : Nat; // INR
    classType : FlightClass;
  };

  type Booking = {
    pnr : Text;
    flight : Flight;
    passengers : [Passenger];
    bookingTime : Int;
    totalAmount : Nat;
    contactEmail : Text;
  };

  module Booking {
    public type t = Booking;
    public func compare(book1 : Booking, book2 : Booking) : Order.Order {
      Text.compare(book1.pnr, book2.pnr);
    };
  };

  type FlightSearchCriteria = {
    origin : Text;
    destination : Text;
    date : Time.Time; // Search date
    passengers : Nat;
    classType : FlightClass;
  };

  type PNR = Text;
  type Email = Text;

  let flights = List.fromArray<Flight>([
    {
      flightNumber = "6E101";
      airline = "IndiGo";
      origin = "DEL";
      destination = "BOM";
      departureTime = 1712856000;
      arrivalTime = 1712863200;
      price = 6500;
      classType = #economy;
    },
    {
      flightNumber = "AI202";
      airline = "Air India";
      origin = "BOM";
      destination = "BLR";
      departureTime = 1712870400;
      arrivalTime = 1712877600;
      price = 7300;
      classType = #economy;
    },
    {
      flightNumber = "SG303";
      airline = "SpiceJet";
      origin = "DEL";
      destination = "HYD";
      departureTime = 1712884800;
      arrivalTime = 1712892000;
      price = 8000;
      classType = #economy;
    },
    {
      flightNumber = "UK404";
      airline = "Vistara";
      origin = "BLR";
      destination = "MAA";
      departureTime = 1712899200;
      arrivalTime = 1712902800;
      price = 9500;
      classType = #business;
    },
    {
      flightNumber = "G805";
      airline = "GoAir";
      origin = "DEL";
      destination = "MAA";
      departureTime = 1712913600;
      arrivalTime = 1712920800;
      price = 5700;
      classType = #economy;
    },
    {
      flightNumber = "AI506";
      airline = "Air India";
      origin = "BOM";
      destination = "CCU";
      departureTime = 1712928000;
      arrivalTime = 1712935200;
      price = 12500;
      classType = #business;
    },
    {
      flightNumber = "6E607";
      airline = "IndiGo";
      origin = "DEL";
      destination = "CCU";
      departureTime = 1712942400;
      arrivalTime = 1712949600;
      price = 8400;
      classType = #economy;
    },
    {
      flightNumber = "SG808";
      airline = "SpiceJet";
      origin = "BLR";
      destination = "HYD";
      departureTime = 1712956800;
      arrivalTime = 1712960400;
      price = 8100;
      classType = #economy;
    },
    {
      flightNumber = "UK909";
      airline = "Vistara";
      origin = "DEL";
      destination = "BOM";
      departureTime = 1712971200;
      arrivalTime = 1712978400;
      price = 13500;
      classType = #business;
    },
    {
      flightNumber = "G810";
      airline = "GoAir";
      origin = "BOM";
      destination = "DEL";
      departureTime = 1712985600;
      arrivalTime = 1712992800;
      price = 9400;
      classType = #economy;
    },
  ]);
  let pnrCounter = Map.empty<Text, ()>();
  var bookingIdCounter = 1;

  let bookings = Map.empty<Text, Booking>();

  func generatePNR() : Text {
    bookingIdCounter += 1;
    "PNR" # bookingIdCounter.toText();
  };

  func validatePassenger(passenger : Passenger) {
    if (passenger.name.size() == 0) { Runtime.trap("Name cannot be empty") };
    if (passenger.age == 0) { Runtime.trap("Invalid age") };
    if (passenger.phone.size() != 10) {
      Runtime.trap("Phone number must be 10 digits");
    };
    if (passenger.email.size() == 0 or not passenger.email.contains(#char '@')) {
      Runtime.trap("Invalid email");
    };
  };

  public query func getFlights() : async [Flight] {
    let flightArray = flights.toArray();
    flightArray;
  };

  public query ({ caller }) func getBookings() : async [Booking] {
    bookings.values().toArray().sort();
  };

  public query ({ caller }) func searchFlights(criteria : FlightSearchCriteria) : async [Flight] {
    let filteredFlights = flights.filter(
      func(flight) {
        flight.origin == criteria.origin and flight.destination == criteria.destination and flight.classType == criteria.classType
      }
    );
    filteredFlights.toArray();
  };

  public shared ({ caller }) func createBooking(flightNumber : Text, passengers : [Passenger], contactEmail : Text) : async PNR {
    let flight = switch (flights.find(func(f) { f.flightNumber == flightNumber })) {
      case (null) { Runtime.trap("Flight not found") };
      case (?f) { f };
    };

    if (passengers.size() == 0) { Runtime.trap("At least one passenger required") };

    passengers.forEach(validatePassenger);

    let pnr = generatePNR();
    let totalAmount = flight.price * passengers.size();

    let booking : Booking = {
      pnr;
      flight;
      passengers;
      bookingTime = Time.now();
      totalAmount;
      contactEmail;
    };

    bookings.add(pnr, booking);
    pnr;
  };

  public query ({ caller }) func getBookingByPNR(pnr : Text) : async Booking {
    switch (bookings.get(pnr)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) { booking };
    };
  };

  public query ({ caller }) func getBookingsByEmail(email : Text) : async [Booking] {
    bookings.filter(
      func(_k, b) { b.contactEmail == email }
    ).values().toArray().sort();
  };
};
