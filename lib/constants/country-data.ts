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
    "Japan": "JP",
    "China": "CN",
    "South Korea": "KR",
    "Mexico": "MX",
    "Brazil": "BR"
};

export const PROVINCE_DATA: Record<string, Record<string, string>> = {
    // 美国 50 州 (PayPal 核心要求)
    "US": {
        "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California", "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia", "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa", "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland", "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri", "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey", "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio", "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina", "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont", "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming"
    },
    // 加拿大 13 个省/地区 (PayPal 核心要求)
    "CA": {
        "AB": "Alberta", "BC": "British Columbia", "MB": "Manitoba", "NB": "New Brunswick", "NL": "Newfoundland and Labrador", "NS": "Nova Scotia", "ON": "Ontario", "PE": "Prince Edward Island", "QC": "Quebec", "SK": "Saskatchewan", "NT": "Northwest Territories", "NU": "Nunavut", "YT": "Yukon"
    },
    // 澳大利亚 (简写必须)
    "AU": {
        "NSW": "New South Wales", "VIC": "Victoria", "QLD": "Queensland", "WA": "Western Australia", "SA": "South Australia", "TAS": "Tasmania", "ACT": "Australian Capital Territory", "NT": "Northern Territory"
    },
    // 意大利 (前 10 大省份代码，IT 对信用卡校验极严)
    "IT": {
        "RM": "Roma", "MI": "Milano", "NA": "Napoli", "TO": "Torino", "PA": "Palermo", "GE": "Genova", "FI": "Firenze", "BO": "Bologna", "BA": "Bari", "CT": "Catania"
    },
    // 日本 (主要行政区数字代码)
    "JP": {
        "01": "Hokkaido", "13": "Tokyo", "27": "Osaka", "23": "Aichi", "14": "Kanagawa", "12": "Chiba", "11": "Saitama", "40": "Fukuoka", "47": "Okinawa"
    },
    // 巴西 (必须 2 位简写)
    "BR": {
        "SP": "São Paulo", "RJ": "Rio de Janeiro", "MG": "Minas Gerais", "RS": "Rio Grande do Sul", "PR": "Paraná", "SC": "Santa Catarina", "BA": "Bahia"
    },
    // 中国 (主要收货省份简写)
    "CN": {
        "BJ": "Beijing", "SH": "Shanghai", "GD": "Guangdong", "JS": "Jiangsu", "ZE": "Zhejiang", "SC": "Sichuan"
    }
};

export const POSTAL_CODE_REGEX: Record<string, RegExp> = {
    "US": /^\d{5}(-\d{4})?$/,             // 美国: 12345 或 12345-6789
    "CA": /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i,  // 加拿大: A1B 2C3 (忽略大小写)
    "GB": /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i, // 英国
    "AU": /^\d{4}$/,                      // 澳大利亚: 4位数字
    "DE": /^\d{5}$/,                      // 德国: 5位数字
    "IT": /^\d{5}$/,                      // 意大利: 5位数字
    "CN": /^\d{6}$/,                      // 中国: 6位数字
    "JP": /^\d{3}-\d{4}$|^\d{7}$/         // 日本: 123-4567 或 1234567
};

export const COUNTRIES_FOR_SELECT = Object.keys(COUNTRY_DATA).sort();

// 电话号码格式提示
export const PHONE_FORMAT_HINTS: Record<string, string> = {
    "US": "(555) 123-4567",
    "CA": "(555) 123-4567",
    "GB": "07700 900123",
    "AU": "0412 345 678",
    "DE": "+49 170 1234567",
    "FR": "+33 6 12 34 56 78",
    "IT": "+39 312 345 6789",
    "ES": "+34 612 345 678",
    "JP": "+81 90-1234-5678",
    "CN": "+86 138 1234 5678",
    "KR": "+82 10-1234-5678",
    "MX": "+52 55 1234 5678",
    "BR": "+55 11 91234-5678"
};