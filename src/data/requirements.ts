import type { Requirement } from "@/types";

// ============================================================================
// REQUIREMENTS SEED DATA — researched Sept 2026, PLEASE FACT-CHECK BEFORE DEMO
// ============================================================================
// One entry per (destination × category) — 18 total across UK/Japan/Germany.
// `leadTimeDays` = days BEFORE program start this must be done.
// A NEGATIVE leadTimeDays means the deadline falls AFTER the start date
// (e.g. "open a bank account within 2 weeks of arrival" = leadTimeDays: -14),
// which is realistic for a few tasks (banking, health insurance enrollment)
// that legally/practically can't happen until you're in-country.
// `isHardDeadline` = true if missing it can block travel/legal status/
// enrollment outright; false if it's a strong best-practice buffer.
// Every entry has a `sourceNote` — several flag genuine uncertainty
// (fee changes, conflicting phone numbers, institution-specific deadlines)
// that a human should verify before relying on this for a real trip.
// ============================================================================

export const requirements: Requirement[] = [
  // ---------------------------------------------------------------- UK ----
  {
    id: "usa-uk-visa",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "visa",
    title: "Apply for UK Student visa & attend biometrics appointment",
    description:
      "Apply online once your university issues a CAS (Confirmation of Acceptance for Studies), then attend a biometrics appointment at a visa application center. You can apply up to 6 months before your course starts; Home Office service standard is a decision within 3 weeks, but book biometrics early since slots fill up.",
    leadTimeDays: 90,
    isHardDeadline: true,
    sourceNote:
      "gov.uk/student-visa and gov.uk/student-visa/how-to-apply. 90-day lead time is a derived practical buffer, not an official government figure — no single authoritative 'start by' date exists.",
  },
  {
    id: "usa-uk-health",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "health",
    title: "Review health documentation (no mandatory vaccines for US entrants)",
    description:
      "The UK requires no routine vaccinations for US citizens entering to study, and TB screening only applies to applicants from certain high-incidence countries (not the US). Check your program for any university-specific immunization requests.",
    leadTimeDays: 30,
    isHardDeadline: false,
    sourceNote: "UKCISA healthcare guide: ukcisa.org.uk/student-advice/life-in-the-uk/healthcare/",
  },
  {
    id: "usa-uk-insurance",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "insurance",
    title: "Pay the Immigration Health Surcharge (IHS) with your visa application",
    description:
      "The IHS (£776/year of study, paid as a lump sum for your full visa duration) gives full NHS access — no separate private health insurance is required for programs over 6 months. Programs under 6 months use a Short-term Study visa instead, which requires private insurance since IHS isn't available.",
    leadTimeDays: 90,
    isHardDeadline: true,
    sourceNote:
      "gov.uk/immigration-health-surcharge; UKCISA. Paid at the same time as the visa application, so shares its lead time.",
  },
  {
    id: "usa-uk-housing",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "housing",
    title: "Accept university halls offer & pay accommodation deposit",
    description:
      "Halls offers typically require an advance payment/deposit (~£150–£300) within about 2 weeks of the offer, with most universities' final 'guarantee' deadline for a September start falling in June/July. There's no single national deadline — check your specific university's accommodation portal.",
    leadTimeDays: 75,
    isHardDeadline: false,
    sourceNote: "mystudenthalls.com/news/how-to-book-student-accommodation/ — varies by university.",
  },
  {
    id: "usa-uk-academic",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "academic",
    title: "Submit credit-transfer pre-approval paperwork to your home institution",
    description:
      "Most US study-abroad offices require signed course pre-approval forms before you depart, often tied to financial aid disbursement. Typical windows range from 2–8 weeks before departure depending on the school — confirm your home institution's exact deadline.",
    leadTimeDays: 45,
    isHardDeadline: false,
    sourceNote:
      "Institution-specific — examples: UGA (3+ weeks), UMass Boston (4–8 weeks), Marquette (2+ weeks). Verify against the student's actual home school.",
  },
  {
    id: "usa-uk-banking",
    originCountry: "USA",
    destCountry: "United Kingdom",
    category: "banking",
    title: "Open a UK bank account after arrival",
    description:
      "You'll need your passport/eVisa, a 'Confirmation of Study' letter (issued only after full enrollment), and proof of UK address. This can't be completed until after arrival/enrollment — budget 1–3 weeks end-to-end.",
    leadTimeDays: -14,
    isHardDeadline: false,
    sourceNote: "King's College London banking guide: self-service.kcl.ac.uk/article/ka-01702/en-us",
  },

  // ------------------------------------------------------------ Japan ----
  {
    id: "usa-japan-visa",
    originCountry: "USA",
    destCountry: "Japan",
    category: "visa",
    title: "Start Certificate of Eligibility (CoE) + student visa process",
    description:
      "Your host institution applies for a Certificate of Eligibility (CoE) with Japan's Immigration Services Agency (often 1–3 months), then you take the CoE to a Japanese consulate in the US for the visa stamp. Don't start more than ~6 months out — a CoE is only valid for about 3 months after issuance.",
    leadTimeDays: 150,
    isHardDeadline: true,
    sourceNote:
      "study-abroad.org and japan-visa.com processing-time guides; qogentglobal.com pre-departure visa process.",
  },
  {
    id: "usa-japan-health",
    originCountry: "USA",
    destCountry: "Japan",
    category: "health",
    title: "Submit health/immunization records requested by your host university",
    description:
      "Japan has no routine entry-vaccine mandate for US citizens, and pre-entry TB screening (JPETS) applies only to a specific list of other countries, not the US. Universities commonly still request a general health form and immunization history (e.g. measles, rubella) as an admissions requirement.",
    leadTimeDays: 60,
    isHardDeadline: false,
    sourceNote: "life.gmc.nagoya-u.ac.jp/en/arrival/screening/; jpets.mhlw.go.jp",
  },
  {
    id: "usa-japan-insurance",
    originCountry: "USA",
    destCountry: "Japan",
    category: "insurance",
    title: "Enroll in National Health Insurance (NHI) at your ward office",
    description:
      "Legally required for any stay of 3+ months — enroll within 14 days of registering your address at the local municipal ward office. NHI covers 70% of costs (~¥1,500–2,500/month premium for a student with no prior Japan income). Also ask your university whether it requires supplemental accident/liability coverage (e.g. 'Gakkensai').",
    leadTimeDays: -14,
    isHardDeadline: true,
    sourceNote:
      "koukyuu.com health-insurance-japan-foreigners-guide; Hokkaido University international student handbook.",
  },
  {
    id: "usa-japan-housing",
    originCountry: "USA",
    destCountry: "Japan",
    category: "housing",
    title: "Secure student housing (dorm application or private apartment + guarantor)",
    description:
      "University dorms are limited-capacity — roughly 79% of international students end up in private housing. Private apartments typically require reikin (non-refundable key money, ~1–2 months' rent) plus shikikin (refundable deposit, ~1–2 months' rent), and usually a Japanese guarantor or paid guarantor company. Budget 2–3 months' rent upfront and start early since leases are hard to sign remotely.",
    leadTimeDays: 60,
    isHardDeadline: false,
    sourceNote: "e-housing.jp/post/students-rent-in-japan; arealty.jp rental deposit guide.",
  },
  {
    id: "usa-japan-academic",
    originCountry: "USA",
    destCountry: "Japan",
    category: "academic",
    title: "Submit credit-transfer pre-approval paperwork to your home institution",
    description:
      "As with any study-abroad program, get course credit pre-approved by your home institution before departure — typical windows are 4–8 weeks out, but this is set by your home school, not Japan.",
    leadTimeDays: 45,
    isHardDeadline: false,
    sourceNote: "Institution-specific — examples: UMass Boston, UVA transfer-credit instructions.",
  },
  {
    id: "usa-japan-banking",
    originCountry: "USA",
    destCountry: "Japan",
    category: "banking",
    title: "Open a Japanese bank account after receiving your Residence Card",
    description:
      "You'll need your zairyu (Residence) Card, proof of registered address, student ID, and sometimes a personal seal (hanko), though signatures are increasingly accepted. Many banks informally expect ~6 months of residency first; Japan Post Bank (Yucho) is the well-known exception that opens accounts for new arrivals.",
    leadTimeDays: -7,
    isHardDeadline: false,
    sourceNote: "japan-life.ziko-info.com bank-account guide; gaijinblog.com bank account guide.",
  },

  // ---------------------------------------------------------- Germany ----
  {
    id: "usa-germany-visa",
    originCountry: "USA",
    destCountry: "Germany",
    category: "visa",
    title: "Book residence permit (Aufenthaltserlaubnis) appointment",
    description:
      "US citizens are a visa-exempt nationality: you can enter Germany for any length of study without a pre-arrival visa and instead apply for a residence permit after arrival at the local Ausländerbehörde, within your 90-day visa-free window. Many cities (Berlin included) have appointment backlogs of weeks to months, so try to book — even before departure, if the city's portal allows it — as early as possible.",
    leadTimeDays: 60,
    isHardDeadline: true,
    sourceNote:
      "germany.info/us-en/service/visa/study-visa-916776 confirms the visa-exempt path; the 90-day filing window is the hard legal deadline, appointment backlogs make early booking practically essential.",
  },
  {
    id: "usa-germany-health",
    originCountry: "USA",
    destCountry: "Germany",
    category: "health",
    title: "Get proof of measles immunity ready",
    description:
      "No US-specific vaccines are legally required for entry, but under Germany's Masernschutzgesetz (Measles Protection Act), universities and dorms can require proof of 1–2 measles vaccine doses before you can enroll or move in.",
    leadTimeDays: 30,
    isHardDeadline: false,
    sourceNote: "Confirmed at University of Göttingen: uni-goettingen.de/en/631007.html",
  },
  {
    id: "usa-germany-insurance",
    originCountry: "USA",
    destCountry: "Germany",
    category: "insurance",
    title: "Arrange German student health insurance",
    description:
      "Proof of health insurance is required for enrollment and your residence permit. Students under 30 (roughly, or under the 14th semester) typically qualify for public ('gesetzliche') student insurance at ~€120–150/month; otherwise private ('privat') insurance is needed. Get a short-term travel policy to bridge the gap until your long-term coverage starts.",
    leadTimeDays: 45,
    isHardDeadline: true,
    sourceNote:
      "DAAD health insurance guide (daad.de) and cbs.de student health insurance blog — premium cited €120–150/month across sources, not one fixed number.",
  },
  {
    id: "usa-germany-housing",
    originCountry: "USA",
    destCountry: "Germany",
    category: "housing",
    title: "Apply for Studentenwerk dorm or budget your Kaution (deposit)",
    description:
      "Studentenwerk dormitory application deadlines are commonly June 15 (winter semester) / January 15 (summer semester), though this varies by city — check your specific city's Studentenwerk site. Private-market deposits (Kaution) are legally capped at 3 months' cold rent (Kaltmiete) under §551 BGB, payable in up to 3 installments.",
    leadTimeDays: 90,
    isHardDeadline: false,
    sourceNote:
      "studentenwerk-hannover.de living/application-faq; sw-ka.de wohnen-faq; allaboutberlin.com/guides/mietkaution for the legal deposit cap.",
  },
  {
    id: "usa-germany-academic",
    originCountry: "USA",
    destCountry: "Germany",
    category: "academic",
    title: "Submit ECTS credit-transfer pre-approval paperwork to your home institution",
    description:
      "Best practice is to submit ECTS/credit pre-approval forms the semester before departure — transfer-credit processing itself can take up to 8 weeks. This deadline is set by your home institution, not by Germany.",
    leadTimeDays: 45,
    isHardDeadline: false,
    sourceNote: "DTU and Georgia Tech exchange credit-transfer instructions — institution-specific.",
  },
  {
    id: "usa-germany-banking",
    originCountry: "USA",
    destCountry: "Germany",
    category: "banking",
    title: "Open a blocked account (Sperrkonto) as proof of funds",
    description:
      "Required as financial proof for your residence permit: roughly €992/month, ~€11,904 total for a year (2026 rate), deposited before your permit is approved. Traditional banks (Sparkasse, Commerzbank, DKB) typically want an Anmeldung (address registration) first; neobanks (N26, bunq) will open a blocked account with just your passport and a temporary address.",
    leadTimeDays: 60,
    isHardDeadline: true,
    sourceNote: "expatrio.com/about-germany/blocked-amount-2025; cbs.de blocked account guide.",
  },
];
