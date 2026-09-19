import type { ExchangePartner } from "@/types";

// ============================================================================
// CMU EXCHANGE PARTNERS — verified directly from Carnegie Mellon's public
// study-abroad site (cmu.edu/studyabroad/getting-started/opportunities/
// university-exchange.html), fetched Sept 2026. Real, named partner
// universities — not a general "countries CMU works with" guess.
// ============================================================================

export const exchangePartners: ExchangePartner[] = [
  { country: "Australia", university: "University of Melbourne", city: "Melbourne" },
  { country: "Chile", university: "Pontificia Universidad Católica de Chile", city: "Santiago" },
  { country: "Hong Kong", university: "City University of Hong Kong", city: "Hong Kong" },
  { country: "Israel", university: "Technion Israel Institute of Technology", city: "Haifa" },
  { country: "Japan", university: "Keio University", city: "Tokyo" },
  { country: "Mexico", university: "Monterrey Tech (ITESM)", city: "Monterrey" },
  { country: "Qatar", university: "Carnegie Mellon University – Qatar", city: "Doha" },
  { country: "Singapore", university: "National University of Singapore (NUS)", city: "Singapore" },
  { country: "Switzerland", university: "École Polytechnique Fédérale de Lausanne (EPFL)", city: "Lausanne" },
];
