// store/useFacilityStore.ts
import { create } from "zustand";
// types/facility.ts
 interface FacilityCategory {
  id: string;
  name: string;
}

 interface Facility {
  id: string;
  coverImage: string;
  images: string[];
  name: string;
  rate: number;
  category: FacilityCategory;
  description: string;
  price: number;
  location: {
    lat: number;
    lng: number;
  };
  address: string;
  webSite: string;
  taxNumber: string;
  startDate:Date;
  endDate :Date;
}
interface FacilityState {
  facility: Facility | null;
  setFacility: (data: Facility) => void;
  updateFacility: (data: Partial<Facility>) => void;
  clearFacility: () => void;
}

export const useFacilityStore = create<FacilityState>((set) => ({
  facility: null,

  setFacility: (data) => set({ facility: data }),

  updateFacility: (data) =>
    set((state) => ({
      facility: state.facility
        ? { ...state.facility, ...data }
        : state.facility,
    })),

  clearFacility: () => set({ facility: null }),
}));