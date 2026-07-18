export type TaxSlab = {
  min: number;
  max: number | null;
  rate: number;
  fixed: number;
  label: string;
};

// Salaried individual slabs — Tax Year 2027 (FY 2026-27), Finance Bill 2026,
// effective 1 July 2026. Source: FBR Budget 2026-27 Salient Features
// (fbr.gov.pk/Budget2026-27/SalientFeatures/Salient-Feature.pdf).
// Top slab threshold raised from Rs 4.1m to Rs 7m; two new intermediate
// slabs (29%, 32%) added; 0-600k and 600k-1.2m bands unchanged.
export const SALARIED_SLABS: TaxSlab[] = [
  { min: 0, max: 600000, rate: 0, fixed: 0, label: "0%" },
  { min: 600000, max: 1200000, rate: 0.01, fixed: 0, label: "1%" },
  { min: 1200000, max: 2200000, rate: 0.11, fixed: 6000, label: "11%" },
  { min: 2200000, max: 3200000, rate: 0.2, fixed: 116000, label: "20%" },
  { min: 3200000, max: 4100000, rate: 0.25, fixed: 316000, label: "25%" },
  { min: 4100000, max: 5600000, rate: 0.29, fixed: 541000, label: "29%" },
  { min: 5600000, max: 7000000, rate: 0.32, fixed: 976000, label: "32%" },
  { min: 7000000, max: null, rate: 0.35, fixed: 1424000, label: "35%" },
];

// Non-salaried / business individual slabs — not amended by Finance Bill
// 2026 (top rate stays 45%); carried over unchanged for Tax Year 2027.
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

// The 9% surcharge on salaried individuals earning above Rs 10m/year was
// abolished under Finance Bill 2026, effective Tax Year 2027 (1 July 2026).
// It has NOT been confirmed removed for non-salaried/business individuals —
// SURCHARGE_BUSINESS is left unchanged pending confirmation against the
// final Finance Act gazette notification.
export const SURCHARGE_SALARIED = 0;
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

// Withholding tax rates — updated for Tax Year 2027 (FY 2026-27), effective
// 1 July 2026 per Finance Bill 2026 (passed by National Assembly 23 June 2026).
// Entries marked "unchanged" were not flagged as amended in the FBR Salient
// Features document and are carried over as-is; verify against the final
// Finance Act gazette notification before relying on them for filing.
export const whtRates = {
  salary: { filer: 0, nonFiler: 0, section: "Sec 149", note: "Applied via slab rates by employer" },
  cashWithdrawal: { filer: 0, nonFiler: 0.008, section: "Sec 231AB", note: "Above PKR 50,000/day (non-filer rate raised to 0.8%)" },
  bankProfit: { filer: 0.15, nonFiler: 0.3, section: "Sec 151", note: "Profit / interest / savings (individuals/AOPs)" },
  dividendsListed: { filer: 0.15, nonFiler: 0.25, section: "Sec 150", note: "Listed companies dividends (unchanged)" },
  dividendsMutualFund: { filer: 0.15, nonFiler: 0.25, section: "Sec 150", note: "Mutual fund dividends (unchanged)" },
  propertyPurchase: { filer: 0.015, nonFiler: 0.12, section: "Sec 236K", note: "Property purchase WHT — reduced to a flat 1.5% for filers" },
  propertySale: { filer: 0.0275, nonFiler: 0.1, section: "Sec 236C", note: "Property sale WHT — reduced to a flat 2.75% for filers" },
  goodsPayment: { filer: 0.045, nonFiler: 0.09, section: "Sec 153", note: "Company to supplier goods payment (unchanged)" },
  servicesGeneral: { filer: 0.15, nonFiler: 0.3, section: "Sec 153", note: "General / professional services payment (unchanged)" },
  servicesIT: { filer: 0.04, nonFiler: 0.08, section: "Sec 153", note: "IT / IT-enabled services (unchanged)" },
  servicesTransport: { filer: 0.07, nonFiler: 0.14, section: "Sec 153", note: "Transport services — raised from 6%/12%" },
  servicesContract: { filer: 0.08, nonFiler: 0.16, section: "Sec 153", note: "Contract / sub-contract, individuals & AOPs — raised from 7%/14%" },
  rent: { filer: 0.15, nonFiler: 0.3, section: "Sec 155", note: "Rent payment by company (unchanged)" },
  commission: { filer: 0.12, nonFiler: 0.24, section: "Sec 233", note: "Commission / brokerage (unchanged)" },
  prizeBond: { filer: 0.15, nonFiler: 0.3, section: "Sec 156", note: "Prize bonds / lottery winnings (unchanged)" },
  auctionTender: { filer: 0.1, nonFiler: 0.2, section: "Sec 236A", note: "Auction / sale by tender (unchanged)" },
  foreignCard: { filer: 0.005, nonFiler: 0.005, section: "Sec 236Y", note: "Foreign card transactions — cut from 5% to a flat 0.5%" },
  exportProceeds: { filer: 0.0125, nonFiler: 0.0125, section: "Sec 154", note: "Export proceeds — unified into a single 1.25% minimum tax (replaces old 1%+1%)" },
  itExportPseb: { filer: 0.0025, nonFiler: 0.0025, section: "Sec 154A", note: "PSEB IT exports final tax — rate unchanged, extended to Tax Year 2029" },
} as const;

export type WhtCategory = keyof typeof whtRates;