import type { EmergencyInfo } from "@/types";

// ============================================================================
// EMERGENCY CARD SEED DATA — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO
// ============================================================================
// Displayed on a static page with no fetch calls once loaded, so it works
// offline (see the emergency card page for a note on adding a service worker
// post-hackathon for full offline caching). Uses the primary/capital-city
// embassy as a reasonable default — a real program may be closer to a
// different consulate, which the UI notes.
// ============================================================================

export const emergencyInfo: EmergencyInfo[] = [
  {
    destCountry: "United Kingdom",
    localEmergencyNumber: "999 (or 112) — fire, police, ambulance",
    usEmbassyName: "U.S. Embassy London",
    usEmbassyAddress: "33 Nine Elms Lane, London SW11 7US, United Kingdom",
    usEmbassyPhone: "+44 20 7499 9000",
    usEmbassyEmergencyPhone: "+44 20 7499 9000 (same number, staffed 24/7 for US citizen emergencies)",
    notes:
      "State Department Overseas Citizens Services emergency line (from abroad): +1-202-501-4444. Source: uk.usembassy.gov/contact/",
  },
  {
    destCountry: "Japan",
    localEmergencyNumber: "110 (police), 119 (ambulance/fire) — these are different numbers",
    usEmbassyName: "U.S. Embassy Tokyo",
    usEmbassyAddress: "1-10-5 Akasaka, Minato-ku, Tokyo 107-8420, Japan",
    usEmbassyPhone: "+81-3-3224-5000",
    usEmbassyEmergencyPhone: "+81-3-3224-5000 (routes to the duty officer after hours)",
    notes: "Source: jp.usembassy.gov/services/emergency-contact/ and /services/calling-for-help/",
  },
  {
    destCountry: "Germany",
    localEmergencyNumber: "112 (fire/medical, EU-wide) / 110 (police)",
    usEmbassyName: "U.S. Consulate General Berlin (American Citizen Services)",
    usEmbassyAddress: "Clayallee 170, 14191 Berlin, Germany",
    usEmbassyPhone: "+49-30-8305-0",
    usEmbassyEmergencyPhone: "+49-30-8305-0 (same number, 24/7 for US citizen emergencies)",
    notes:
      "UNVERIFIED CONFLICT — flag for manual check before demo: research turned up a differing routine-services number (+49-69-7535-2100) that appears to belong to Frankfurt's consulate, not Berlin's. The main Berlin chancery (for reference, not where citizen services happen) is at Pariser Platz 2, 10117 Berlin. Confirm both address and phone directly at de.usembassy.gov/contact/ before relying on this for a demo.",
  },
];
