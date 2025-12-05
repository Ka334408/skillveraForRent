// store/useReservationStore.ts
import { create } from "zustand";

interface Reservation {
  facilityId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  name: string;
  imaga : string;
}

interface ReservationState {
  reservation: Reservation | null;
  setReservation: (data: Reservation) => void;
  clearReservation: () => void;
}

export const useReservationStore = create<ReservationState>((set) => ({
  reservation: null,
  setReservation: (data) => set({ reservation: data }),
  clearReservation: () => set({ reservation: null }),
}));