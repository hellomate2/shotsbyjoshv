"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Service } from "@/lib/types";

interface BookingContextValue {
  open: boolean;
  initialService: Service | null;
  openModal: (service?: Service) => void;
  closeModal: () => void;
}

const BookingContext = createContext<BookingContextValue | null>(null);

export function BookingProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [initialService, setInitialService] = useState<Service | null>(null);

  const openModal = useCallback((service?: Service) => {
    setInitialService(service ?? null);
    setOpen(true);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "hidden";
    }
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
    setInitialService(null);
    if (typeof document !== "undefined") {
      document.body.style.overflow = "";
    }
  }, []);

  const value = useMemo(
    () => ({ open, initialService, openModal, closeModal }),
    [open, initialService, openModal, closeModal]
  );

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used within BookingProvider");
  return ctx;
}
