import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  availableFrom: string;
  priceRange: [number, number] | [null, null];
  squareFeet: [number, number] | [null, null];
  coordinates: [number, number];
}

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "Amman",
    beds: "any",
    baths: "any",
    propertyType: "any",
    availableFrom: "any",
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [35.9106, 31.9539], // Amman, Jordan
  },
  isFiltersFullOpen: false,
  viewMode: "grid",
};

export interface PricingRequest {
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: string;
  furnished: boolean;
  location: string;
  city: string;
  latitude: number;
  longitude: number;
  country: string;
  managerPrice: number;
}

export interface PricingResult {
  country: string;
  predicted_price: number | null;
  predicted_price_monthly: number | null;
  minimum_allowed_price: number | null;
  manager_price_valid: boolean;
  price_label: "Low" | "Medium" | "High" | "Not Classified";
  message: string;
  rent_category?: string;
  category_description?: string;
}




export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
  },
});

export const { setFilters, toggleFiltersFullOpen, setViewMode } =
  globalSlice.actions;

export default globalSlice.reducer;
