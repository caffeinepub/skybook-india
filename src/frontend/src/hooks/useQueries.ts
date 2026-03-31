import { useMutation, useQuery } from "@tanstack/react-query";
import type { FlightSearchCriteria, Passenger } from "../backend.d";
import { FlightClass } from "../backend.d";
import { useActor } from "./useActor";

export function useSearchFlights(criteria: FlightSearchCriteria | null) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["flights", criteria],
    queryFn: async () => {
      if (!actor || !criteria) return [];
      return actor.searchFlights(criteria);
    },
    enabled: !!actor && !isFetching && !!criteria,
  });
}

export function useGetAllFlights() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allFlights"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getFlights();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBookingByPNR(pnr: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["booking", pnr],
    queryFn: async () => {
      if (!actor || !pnr) return null;
      return actor.getBookingByPNR(pnr);
    },
    enabled: !!actor && !isFetching && !!pnr,
  });
}

export function useGetBookingsByEmail(email: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["bookings", email],
    queryFn: async () => {
      if (!actor || !email) return [];
      return actor.getBookingsByEmail(email);
    },
    enabled: !!actor && !isFetching && !!email,
  });
}

export function useGetAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  return useMutation({
    mutationFn: async ({
      flightNumber,
      passengers,
      contactEmail,
    }: {
      flightNumber: string;
      passengers: Passenger[];
      contactEmail: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(flightNumber, passengers, contactEmail);
    },
  });
}

export { FlightClass };
