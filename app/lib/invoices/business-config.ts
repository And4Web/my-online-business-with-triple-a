
export const BUSINESS_CONFIG = {
  legalName: "Anand Shukla",
  tradeName: "Divine Flame IT Solutions",
  displayName: "Divine Flame IT Solutions",

  website: "https://www.and4web.co.in",

  gstin: "09FBWPS2567E1ZU",
  sacCode: "998434",
  standardGstRate: 18,

  address: {
    building: "39B/4",
    street: "Ganga Road",
    landmark: "Sita Nursery Shivkuti",
    locality: "Shiv Kuti",
    city: "Prayagraj",
    district: "Prayagraj",
    state: "Uttar Pradesh",
    stateCode: "09",
    postalCode: "211004",
    country: "India",
  },

  lut: {
    arn: "AD091126020350M",
    date: "19/11/2026",
  },
} as const;

export const BUSINESS_ADDRESS = [
  BUSINESS_CONFIG.address.building,
  BUSINESS_CONFIG.address.street,
  BUSINESS_CONFIG.address.locality,
  BUSINESS_CONFIG.address.city,
  BUSINESS_CONFIG.address.district,
  BUSINESS_CONFIG.address.state,
  BUSINESS_CONFIG.address.postalCode,
  BUSINESS_CONFIG.address.country,
].join(", ");
