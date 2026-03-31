import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Passenger {
    age: bigint;
    name: string;
    email: string;
    gender: Gender;
    phone: string;
}
export type Time = bigint;
export type PNR = string;
export interface Flight {
    destination: string;
    arrivalTime: bigint;
    flightNumber: string;
    departureTime: bigint;
    origin: string;
    airline: string;
    price: bigint;
    classType: FlightClass;
}
export interface Booking {
    pnr: string;
    flight: Flight;
    passengers: Array<Passenger>;
    totalAmount: bigint;
    bookingTime: bigint;
    contactEmail: string;
}
export interface FlightSearchCriteria {
    destination: string;
    date: Time;
    origin: string;
    passengers: bigint;
    classType: FlightClass;
}
export enum FlightClass {
    economy = "economy",
    business = "business"
}
export enum Gender {
    other = "other",
    female = "female",
    male = "male"
}
export interface backendInterface {
    createBooking(flightNumber: string, passengers: Array<Passenger>, contactEmail: string): Promise<PNR>;
    getBookingByPNR(pnr: string): Promise<Booking>;
    getBookings(): Promise<Array<Booking>>;
    getBookingsByEmail(email: string): Promise<Array<Booking>>;
    getFlights(): Promise<Array<Flight>>;
    searchFlights(criteria: FlightSearchCriteria): Promise<Array<Flight>>;
}
