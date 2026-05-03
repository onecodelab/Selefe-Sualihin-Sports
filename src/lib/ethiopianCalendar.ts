export interface EthiopianDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
}

const ethiopianMonths = [
  "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ", "ጥር", "የካቲት",
  "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "ጳጉሜ"
];

const ethiopianDays = [
  "እሁድ", "ሰኞ", "ማክሰኞ", "ረቡዕ", "ሐሙስ", "አርብ", "ቅዳሜ"
];

export const toEthiopianDate = (date: Date): EthiopianDate => {
  const jdn = getJDN(date);
  return jdnToEthiopian(jdn);
};

export const getEthiopianMonthName = (month: number): string => {
  return ethiopianMonths[month - 1] || "";
};

export const getEthiopianDayName = (date: Date): string => {
  return ethiopianDays[date.getDay()];
};

// Helper logic for Julian Day Number
function getJDN(date: Date): number {
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();

  if (month <= 2) {
    year -= 1;
    month += 12;
  }

  const a = Math.floor(year / 100);
  const b = 2 - a + Math.floor(a / 4);

  return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + b - 1524.5;
}

function jdnToEthiopian(jdn: number): EthiopianDate {
  const r = (jdn - 1723856) % 1461;
  const n = (r % 365) + 365 * Math.floor(r / 1460);

  const year = 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460);
  const month = Math.floor(n / 30) + 1;
  const day = (n % 30) + 1;

  return {
    year: year,
    month: month,
    day: day,
    monthName: ethiopianMonths[month - 1]
  };
}

export const formatEthiopianFull = (date: Date): string => {
  const eth = toEthiopianDate(date);
  const dayName = getEthiopianDayName(date);
  return `${dayName}፣ ${eth.monthName} ${eth.day} ቀን ${eth.year} ዓ.ም`;
};
