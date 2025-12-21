// lib/constants/country-data.ts

export const COUNTRY_DATA: Record<string, string> = {
    "United States": "US",
    "United Kingdom": "GB",
    "Canada": "CA",
    "Australia": "AU",
    "Germany": "DE",
    "France": "FR",
    "Italy": "IT",
    "Spain": "ES",
    // 添加更多国家
    "Japan": "JP",
    "China": "CN",
    "South Korea": "KR",
    "Mexico": "MX",
    "Brazil": "BR",
    "India": "IN"
    // 更多国家...
};

export const COUNTRIES_FOR_SELECT = Object.keys(COUNTRY_DATA).sort();