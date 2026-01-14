"use client";

import { useTranslations } from "next-intl";

/**
 * Currency utility hook for formatting prices based on country
 * Supports Jordan (JD/دينار) and UAE (AED/درهم)
 */
export function useCurrency() {
  const t = useTranslations("currency");

  /**
   * Get the currency symbol for a given country
   */
  const getCurrencySymbol = (country?: string): string => {
    if (!country) return t("default");
    
    const normalizedCountry = country.toLowerCase();
    
    if (normalizedCountry === "jordan" || normalizedCountry === "jo") {
      return t("jordan");
    }
    if (normalizedCountry === "uae" || normalizedCountry === "united arab emirates" || normalizedCountry === "ae") {
      return t("uae");
    }
    
    return t("default");
  };

  /**
   * Format a price with the appropriate currency symbol
   */
  const formatPrice = (
    price: number,
    country?: string,
    options?: { showPerMonth?: boolean; compact?: boolean }
  ): string => {
    const symbol = getCurrencySymbol(country);
    const { showPerMonth = false, compact = false } = options || {};
    
    let formattedPrice: string;
    
    if (compact && price >= 1000) {
      formattedPrice = `${(price / 1000).toFixed(0)}k`;
    } else {
      formattedPrice = price.toLocaleString();
    }
    
    const priceString = `${formattedPrice} ${symbol}`;
    
    if (showPerMonth) {
      return `${priceString} ${t("perMonth")}`;
    }
    
    return priceString;
  };

  /**
   * Format price range for filters (min or max)
   */
  const formatPriceRange = (
    value: number | null,
    isMin: boolean,
    country?: string
  ): string => {
    const symbol = getCurrencySymbol(country);
    
    if (value === null || value === 0) {
      return isMin ? t("anyMinPrice", { defaultMessage: "Any Min Price" }) : t("anyMaxPrice", { defaultMessage: "Any Max Price" });
    }
    
    if (value >= 1000) {
      const kValue = value / 1000;
      return isMin ? `${kValue}k+ ${symbol}` : `<${kValue}k ${symbol}`;
    }
    
    return isMin ? `${value}+ ${symbol}` : `<${value} ${symbol}`;
  };

  /**
   * Get perMonth text
   */
  const getPerMonthText = (): string => {
    return t("perMonth");
  };

  return {
    getCurrencySymbol,
    formatPrice,
    formatPriceRange,
    getPerMonthText,
  };
}

/**
 * Get currency symbol without hook (for use in non-component contexts)
 * Note: This is a fallback and prefers English symbols
 */
export function getCurrencySymbolByCountry(country?: string, locale: string = "en"): string {
  if (!country) return "$";
  
  const normalizedCountry = country.toLowerCase();
  
  if (normalizedCountry === "jordan" || normalizedCountry === "jo") {
    return locale === "ar" ? "دينار" : "JD";
  }
  if (normalizedCountry === "uae" || normalizedCountry === "united arab emirates" || normalizedCountry === "ae") {
    return locale === "ar" ? "درهم" : "AED";
  }
  
  return "$";
}

/**
 * Get per month text without hook (for use in non-component contexts)
 */
export function getPerMonthTextByLocale(locale: string = "en"): string {
  return locale === "ar" ? "/شهرياً" : "/month";
}
