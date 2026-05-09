export type TaxSlab = {
  min: number;
  max: number | null;
  rate: number;
  fixed: number;
  label: string;
};

export const SALARIED_SLABS: TaxSlab[] = [
  { min: 0, max: 600000, rate: 0, fixed: 0, label: "0%" },
  { min: 600000, max: 1200000, rate: 0.01, fixed: 0, label: "1%" },
  { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000, label: "11%" },
  { min: 2200000, max: 3200000, rate: 0.23, fixed: 116000, label: "23%" },
  { min: 3200000, max: 4100000, rate: 0.3, fixed: 346000, label: "30%" },
  { min: 4100000, max: null, rate: 0.35, fixed: 616000, label: "35%" },
];

export const BUSINESS_SLABS: TaxSlab[] = [
  { min: 0, max: 600000, rate: 0, fixed: 0, label: "0%" },
  { min: 600000, max: 1200000, rate: 0.15, fixed: 0, label: "15%" },
  { min: 1200000, max: 1600000, rate: 0.2, fixed: 90000, label: "20%" },
  { min: 1600000, max: 3200000, rate: 0.25, fixed: 170000, label: "25%" },
  { min: 3200000, max: 5600000, rate: 0.3, fixed: 570000, label: "30%" },
  { min: 5600000, max: 8800000, rate: 0.35, fixed: 1290000, label: "35%" },
  { min: 8800000, max: null, rate: 0.45, fixed: 2410000, label: "45%" },
];

export const ZAKAT_RATE = 0.025;
export const GST_RATE_FEDERAL = 0.18;
export const GST_SERVICES_PUNJAB = 0.16;
export const GST_SERVICES_SINDH = 0.15;
export const GST_SERVICES_KPK = 0.15;
export const GST_SERVICES_BALOCHISTAN = 0.15;
export const GST_SERVICES_ICT = 0.15;

export const SURCHARGE_SALARIED = 0.09;
export const SURCHARGE_BUSINESS = 0.1;

export const formatPKR = (value: number) =>
  new Intl.NumberFormat("ur-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

export const formatNumber = (value: number) =>
  new Intl.NumberFormat("ur-PK", { maximumFractionDigits: 0 }).format(
    Number.isFinite(value) ? value : 0,
  );

export const withCommas = (value: number | string) => {
  const numeric = String(value).replace(/[^\d]/g, "");
  if (!numeric) return "";
  return numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const parseInputNumber = (value: string) => {
  const cleaned = value.replace(/,/g, "").trim();
  const parsed = Number(cleaned);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

export const medicalAllowanceExemption = (annualSalary: number) =>
  Math.min(annualSalary * 0.1, 25000);

export const educationAllowanceExemption = (annualSalary: number) =>
  Math.min(annualSalary * 0.2, 50000);

export const calculateSlabTax = (income: number, slabs: TaxSlab[]) => {
  if (income <= 0) return { tax: 0, slab: slabs[0], breakdown: [] as { label: string; amount: number }[] };

  let matched = slabs[0];
  for (const slab of slabs) {
    const upper = slab.max ?? Number.POSITIVE_INFINITY;
    if (income > slab.min && income <= upper) {
      matched = slab;
      break;
    }
    if (income > slab.min) matched = slab;
  }

  const taxablePart = Math.max(0, income - matched.min);
  const tax = matched.fixed + taxablePart * matched.rate;

  const breakdown = slabs.map((slab) => {
    const upper = slab.max ?? income;
    const span = Math.max(0, Math.min(income, upper) - slab.min);
    return { label: slab.label, amount: span };
  });

  return { tax, slab: matched, breakdown };
};

export const calculateIncomeTax = ({
  monthlySalary,
  annualBonus,
  zakatPaid,
  incomeType,
  hasMedicalAllowance,
}: {
  monthlySalary: number;
  annualBonus: number;
  zakatPaid: number;
  incomeType: "salaried" | "business";
  hasMedicalAllowance: boolean;
}) => {
  const annualSalaryOnly = monthlySalary * 12;
  const annualIncome = annualSalaryOnly + annualBonus;
  const medicalExemption = hasMedicalAllowance
    ? medicalAllowanceExemption(annualSalaryOnly)
    : 0;
  const taxableIncome = Math.max(0, annualIncome - medicalExemption - zakatPaid);

  const slabs = incomeType === "salaried" ? SALARIED_SLABS : BUSINESS_SLABS;
  const slabTax = calculateSlabTax(taxableIncome, slabs);
  const surchargeRate =
    annualIncome > 10000000
      ? incomeType === "salaried"
        ? SURCHARGE_SALARIED
        : SURCHARGE_BUSINESS
      : 0;
  const surcharge = slabTax.tax * surchargeRate;
  const annualTax = slabTax.tax + surcharge;
  const monthlyTax = annualTax / 12;
  const takeHomeMonthly = monthlySalary - monthlyTax;
  const effectiveRate = annualIncome > 0 ? (annualTax / annualIncome) * 100 : 0;

  return {
    annualIncome,
    taxableIncome,
    medicalExemption,
    surcharge,
    annualTax,
    monthlyTax,
    takeHomeMonthly,
    effectiveRate,
    marginalSlab: slabTax.slab,
    breakdown: slabTax.breakdown,
  };
};

export const whtRates = {
  salary: { filer: 0, nonFiler: 0, section: "Sec 149", note: "Applied via slab rates by employer" },
  cashWithdrawal: { filer: 0, nonFiler: 0.006, section: "Sec 231AB", note: "Above PKR 50,000/day" },
  bankProfit: { filer: 0.15, nonFiler: 0.35, section: "Sec 151", note: "Profit / interest / savings" },
  dividendsListed: { filer: 0.15, nonFiler: 0.25, section: "Sec 150", note: "Listed companies dividends" },
  dividendsMutualFund: { filer: 0.15, nonFiler: 0.25, section: "Sec 150", note: "Mutual fund dividends" },
  propertyPurchase: { filer: 0.03, nonFiler: 0.12, section: "Sec 236K", note: "Property purchase WHT" },
  propertySale: { filer: 0.03, nonFiler: 0.1, section: "Sec 236C", note: "Property sale WHT" },
  goodsPayment: { filer: 0.045, nonFiler: 0.09, section: "Sec 153", note: "Company to supplier goods payment" },
  servicesGeneral: { filer: 0.15, nonFiler: 0.3, section: "Sec 153", note: "General services payment" },
  servicesIT: { filer: 0.04, nonFiler: 0.08, section: "Sec 153", note: "IT / IT-enabled services" },
  servicesTransport: { filer: 0.06, nonFiler: 0.12, section: "Sec 153", note: "Transport services" },
  servicesContract: { filer: 0.07, nonFiler: 0.14, section: "Sec 153", note: "Contract / sub-contract" },
  rent: { filer: 0.15, nonFiler: 0.3, section: "Sec 155", note: "Rent payment by company" },
  commission: { filer: 0.12, nonFiler: 0.24, section: "Sec 233", note: "Commission / brokerage" },
  prizeBond: { filer: 0.15, nonFiler: 0.3, section: "Sec 156", note: "Prize bonds / lottery winnings" },
  auctionTender: { filer: 0.1, nonFiler: 0.2, section: "Sec 236A", note: "Auction / sale by tender" },
  foreignCard: { filer: 0.01, nonFiler: 0.1, section: "Sec 236Y", note: "Foreign card transactions" },
  exportProceeds: { filer: 0.01, nonFiler: 0.01, section: "Sec 154", note: "Export proceeds minimum tax" },
  itExportPseb: { filer: 0.0025, nonFiler: 0.0025, section: "Sec 154", note: "PSEB IT exports final tax" },
} as const;

export type WhtCategory = keyof typeof whtRates;
