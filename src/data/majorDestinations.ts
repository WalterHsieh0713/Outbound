import type { MajorDestinationGuide } from "@/types";

// ============================================================================
// DESTINATIONS BY MAJOR — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO.
// `supportedDestCountry` is set ONLY when one of `countries` matches one of
// our 3 fully-supported destinations (UK/Japan/Germany) — that's what lets
// the guide page link out to the real /destinations/{slug} checklist+map
// flow instead of just showing static text. Do not set it just because a
// country is "close enough" — it must be an exact DestCountry match.
// ============================================================================

export const majorDestinationGuides: MajorDestinationGuide[] = [
  {
    major: "Engineering",
    countries: ["Germany", "Switzerland", "Sweden"],
    reason:
      "Germany's TU9 alliance (TU Munich, RWTH Aachen, KIT) offers tuition-free, English-taught technical programs; Switzerland's ETH Zurich and EPFL rank in the global top 5; Sweden's KTH is a leading free, English-taught technical school.",
    supportedDestCountry: "Germany",
    sourceNote: "curominds.com/blog/countries-to-study-engineering/; studyrhino.com/best-countries-to-study-engineering-abroad/",
  },
  {
    major: "Computer Science",
    countries: ["United States", "United Kingdom", "Germany", "Australia"],
    reason:
      "US/UK lead on program prestige and tech-hub proximity (Silicon Valley, London); Germany is the low-cost option with free public tuition; Australia's UTS/UNSW/Adelaide rank top-50 globally.",
    supportedDestCountry: "Germany",
    sourceNote: "edulx.in/blog/best-countries-for-computer-science-students-2026-guide; kanan.co/blog/best-countries-to-study-computer-science/",
  },
  {
    major: "Business / Finance",
    countries: ["United Kingdom", "Singapore", "Hong Kong"],
    reason:
      "London gives access to a major economy with no language barrier; Singapore (NUS, #1 in Asia for QS MBA rankings) blends Eastern/Western markets as a multinational HQ hub; Hong Kong (HKU, HKUST) is a top global banking/trade center.",
    supportedDestCountry: "United Kingdom",
    sourceNote: "goabroad.com/articles/study-abroad/best-places-to-study-abroad-for-finance-majors; semesteratsea.org/study-abroad-for-business/",
  },
  {
    major: "International Relations / Political Science",
    countries: ["Switzerland", "Belgium", "Netherlands"],
    reason:
      "Geneva hosts the UN's second-largest complex plus WHO/WTO/ILO; Brussels is the EU's institutional capital; the Netherlands (Amsterdam, Leiden, Maastricht) offers English-taught IR programs tied to a long diplomatic history.",
    sourceNote: "goabroad.com/articles/study-abroad/where-to-study-international-relations",
  },
  {
    major: "Arts / Design",
    countries: ["Italy", "France"],
    reason:
      "Florence is Italy's cultural capital — Renaissance heritage, museums, and dedicated institutions like Florence University of the Arts offering fashion, design, and fine arts curricula.",
    sourceNote: "ciee.org/go-abroad/college-study-abroad/programs/italy/florence/arts-architecture-and-design; saiprograms.com/florence/fua/",
  },
  {
    major: "Humanities / Language Immersion",
    countries: ["Spain", "Mexico", "Argentina"],
    reason:
      "Spain (Salamanca, Madrid, Barcelona) is the classic Spanish-immersion base with historic universities; Mexico offers the largest Spanish-speaking population at lower cost; Buenos Aires is a major cosmopolitan hub for Spanish study.",
    sourceNote: "globalscholarships.com/best-countries-study-spanish/; ciee.org/go-abroad/college-study-abroad/blog/top-7-spanish-immersion-programs-ciee-study-abroad",
  },
  {
    major: "Natural Sciences (Biology / Environmental)",
    countries: ["Costa Rica", "Australia"],
    reason:
      "Costa Rica holds ~2.5% of global biodiversity across rainforest/volcanic ecosystems, ideal for tropical ecology (e.g. Monteverde Institute); Australia offers marine biology access to the Great Barrier Reef via University of Queensland/Melbourne.",
    sourceNote: "goabroad.com/articles/study-abroad/best-places-to-study-abroad-for-environmental-science",
  },
];
