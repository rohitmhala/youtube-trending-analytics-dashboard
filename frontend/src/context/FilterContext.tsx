import { createContext, useContext, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";

type Filters = {
  region: string;
};

type FilterContextType = {
  filters: Filters;
  setFilters: Dispatch<SetStateAction<Filters>>;
};

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [filters, setFilters] = useState<Filters>({
    region: "ALL",
  });

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);

  if (!context) {
    throw new Error("useFilters must be used inside FilterProvider");
  }

  return context;
};