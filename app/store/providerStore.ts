import { create } from "zustand";
import { persist } from "zustand/middleware";

// -----------------------------------------
// Provider Interface
// -----------------------------------------
interface Provider {
  id: number;
  name: string;
  email: string;
  phone: string;
  image: string | null;
  gender: string;
  dob: string;
  addressLatLong: string;
  type: string; // role
}
interface SignupData {
  name: string;
  email: string;
  phone: string;
  password: string;
}

interface ProviderStore {
  provider: Provider | null;
  token: string | null;

  // local-only image file (NOT persisted)
  newImageFile: File | null;
  signupData:SignupData| null,

  // reset password flow
  resetEmail: string | null;
  verificationEmail: string | null;

  // hydration flag
  isHydrated: boolean;

  // setters
  setProvider: (provider: Provider | null) => void;
  setToken: (token: string | null) => void;
  setSignupData: (data: SignupData) => void;

  setNewImageFile: (file: File | null) => void;

  setResetEmail: (email: string) => void;
  setVerificationEmail: (email: string) => void;

  setHydrated: () => void;

  logout: () => void;
}

// -----------------------------------------
// Zustand Store with Persistence
// -----------------------------------------
export const useProviderStore = create<ProviderStore>()(
  persist(
    (set) => ({
      provider: null,
      token: null,

      newImageFile: null,

      resetEmail: null,
      verificationEmail: null,
      signupData: null,

      isHydrated: false,

      // SETTERS
      setProvider: (provider) => set({ provider }),
      setToken: (token) => set({ token }),

      setNewImageFile: (file) => set({ newImageFile: file }),

      setResetEmail: (email) => set({ resetEmail: email }),
      setVerificationEmail: (email) => set({ verificationEmail: email }),
       setSignupData: (data) => set({ signupData: data }),

      setHydrated: () => set({ isHydrated: true }),

      logout: () =>
        set({
          provider: null,
          token: null,
          resetEmail: null,
          verificationEmail: null,
          signupData: null,
          newImageFile: null,
        }),
    }),
    {
      name: "skillvera-provider-storage",
      partialize: (state) => ({
        provider: state.provider,
        token: state.token,
        resetEmail: state.resetEmail,
        signupData: state.signupData,
        verificationEmail: state.verificationEmail,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.setHydrated();
      },
    }
  )
);