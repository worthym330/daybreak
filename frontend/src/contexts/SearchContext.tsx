import React, { useContext, useState } from "react";

type SearchContextType = {
  destination: string;
  checkIn: Date;
  checkOut?: Date;
  hotelId: string;
  saveSearchValues: (
    destination: string,
    checkIn: Date,
    checkOut?: Date,
    hotelId?: string
  ) => void;
};

const SearchContext = React.createContext<SearchContextType | undefined>(undefined);

type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContextProvider = ({
  children,
}: SearchContextProviderProps) => {
  const [destination, setDestination] = useState<string>(
    () => sessionStorage.getItem("destination") || ""
  );
  const [checkIn, setCheckIn] = useState<Date>(
    () =>
      new Date(sessionStorage.getItem("checkIn") || new Date().toISOString())
  );
  const [checkOut, setCheckOut] = useState<Date | undefined>(
    () => {
      const checkOutString = sessionStorage.getItem("checkOut");
      return checkOutString ? new Date(checkOutString) : undefined;
    }
  );
  const [hotelId, setHotelId] = useState<string>(
    () => sessionStorage.getItem("hotelId") || ""
  );

  const saveSearchValues = (
    destination: string,
    checkIn: Date,
    checkOut?: Date,
    hotelId?: string
  ) => {
    setDestination(destination);
    setCheckIn(checkIn);
    setCheckOut(checkOut);
    if (hotelId) {
      setHotelId(hotelId);
    }

    console.log('destination',destination)

    if(destination){
      sessionStorage.setItem("destination", destination);
    }else{
      sessionStorage.removeItem("destination")
    }
    sessionStorage.setItem("checkIn", checkIn.toISOString());

    if (checkOut) {
      sessionStorage.setItem("checkOut", checkOut.toISOString());
    } else {
      sessionStorage.removeItem("checkOut");
    }

    if (hotelId) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  };

  return (
    <SearchContext.Provider
      value={{
        destination,
        checkIn,
        checkOut,
        hotelId,
        saveSearchValues,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchContext must be used within a SearchContextProvider");
  }
  return context;
};