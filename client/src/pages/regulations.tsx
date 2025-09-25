import { useState, useMemo } from "react";
import { Search, Filter, Building, Phone, MapPin, Clock, BookOpen, FileText, AlertTriangle, CheckCircle, Award, ExternalLink, Users, Scale, Link2, Archive, ChevronDown, ChevronUp } from "lucide-react";

// Complete state data structure for all 28 states
const statesData = {
    "Alaska": {
        "authority": "Alaska Division of Insurance, Dept. of Commerce, Community & Economic Development",
        "address": "550 W. 7th Ave., Ste 1560, Anchorage, AK 99501‑3567",
        "phone": "(907) 269‑7900",
        "director": "Director (acting or appointed) listed on the division's 'About Us' page",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Not required for limited lines (motor-vehicle rental, travel, portable electronics)",
        "examVendor": "Pearson VUE",
        "application": "Via NIPR, submit fingerprints (fee applies) and pay licensing fees",
        "appointments": "Required by each insurer",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "Alaska Insurance Code (Title 21): AS 21.27 (licensing), AS 21.36 (unfair practices), AS 21.42 (rate/form filings), AS 21.80 (guaranty funds)",
        "uniqueFeatures": "Minimum $2 million capital/surplus requirement; Alaska Guaranty Funds handle insolvent insurers; Fraud hotline: (907) 269‑7900",
        "sources": "Alaska Division of Insurance – Resident Licensing; Alaska Statutes Title 21",
        "website": "https://www.commerce.alaska.gov/web/ins/",
        "licensingUrl": "https://www.commerce.alaska.gov/web/ins/Producers/ResidentLicense.aspx",
        "statuteUrl": "https://www.akleg.gov/basis/statutes.asp",
        "guarantyUrl": "https://www.commerce.alaska.gov/web/ins/Consumers/ConsumerTools/AlaskaGuarantyFunds.aspx",
        "aboutUrl": "https://www.commerce.alaska.gov/web/ins/AboutUs/AbouttheDivision.aspx",
        "applicationPortal": "NIPR",
        "examInfo": "Pearson VUE (limited lines like motor vehicle rental, travel, portable electronics no exam)",
        "divisions": "Consumer Services & Investigations; Policy Forms & Rates; Licensing/Financial",
        "statuteReferences": {
            "licensing": "AS §21.27",
            "unfairPractices": "AS §21.36", 
            "ratesForms": "AS §21.42",
            "guaranty": "Alaska Guaranty Funds program"
        },
        "officialSources": [
            {
                "title": "Division home & contact",
                "url": "https://www.commerce.alaska.gov/web/ins/"
            },
            {
                "title": "About the Division",
                "url": "https://www.commerce.alaska.gov/web/ins/AboutUs/AbouttheDivision.aspx"
            },
            {
                "title": "Resident licensing",
                "url": "https://www.commerce.alaska.gov/web/ins/Producers/ResidentLicense.aspx"
            },
            {
                "title": "Alaska Statutes Title 21",
                "url": "https://www.akleg.gov/basis/statutes.asp"
            },
            {
                "title": "Administrative Code Title 3",
                "url": "https://www.akleg.gov/basis/aac.asp"
            }
        ]
    },
    "Arizona": {
        "authority": "Arizona Department of Insurance & Financial Institutions (DIFI)",
        "address": "100 N. 15th Ave., Suite 261, Phoenix, AZ 85007-2630",
        "phone": "(602) 364‑3100",
        "director": "Interim Agency Director Maria Ailor (appointed May 30, 2025)",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required for major lines",
        "examVendor": "PSI (effective Sep 3, 2025)",
        "application": "Submit fingerprints and apply through NIPR",
        "appointments": "Required (ARS §20‑286)",
        "ceHours": "48 hours every 4 years (6 hours ethics)",
        "keyStatutes": "ARS §§20‑281 to 20‑299 (licensing), §20‑295 (denial grounds), §20‑441 et seq. (unfair practices), §§20‑661 – 20‑667 (guaranty funds)",
        "uniqueFeatures": "Four-year CE cycle; electronic fingerprints required; DIFI oversees financial institutions and Arizona Automobile Theft Authority",
        "sources": "DIFI – Licensing; ARS Title 20",
        "website": "https://difi.az.gov/",
        "licensingUrl": "https://difi.az.gov/licensing",
        "statuteUrl": "https://www.azleg.gov/arsDetail/?title=20",
        "guarantyUrl": "https://difi.az.gov/general-information/learn-about-insurance/guaranty-funds",
        "leadershipUrl": "https://difi.az.gov/news",
        "applicationPortal": "DIFI portals/NIPR depending on license class",
        "examInfo": "PSI (effective Sep 3, 2025 per DIFI notices)",
        "divisions": "Insurance; Financial Institutions; Arizona Automobile Theft Authority; Enforcement/Innovation/Policy",
        "statuteReferences": {
            "licensing": "ARS §§20-281–20-299",
            "denialGrounds": "ARS §20-295",
            "unfairPractices": "ARS §20-441 et seq.",
            "guaranty": "ARS §20-661 et seq.",
            "appointments": "ARS §20-286"
        },
        "officialSources": [
            {
                "title": "DIFI home",
                "url": "https://difi.az.gov/"
            },
            {
                "title": "Leadership announcement (Interim Director Ailor)",
                "url": "https://difi.az.gov/news"
            },
            {
                "title": "Licensing overview",
                "url": "https://difi.az.gov/licensing"
            },
            {
                "title": "ARS Title 20 (Insurance)",
                "url": "https://www.azleg.gov/arsDetail/?title=20"
            },
            {
                "title": "Guaranty Funds",
                "url": "https://difi.az.gov/general-information/learn-about-insurance/guaranty-funds"
            }
        ]
    },
    "California": {
        "authority": "California Department of Insurance (CDI)",
        "address": "300 Capitol Mall, Sacramento, CA 95814 (HQ; additional district offices on CDI site)",
        "phone": "(800) 927‑4357",
        "director": "Insurance Commissioner Ricardo Lara (elected)",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "20–40 hours depending on line (e.g., Life 20 hrs + 12 hrs CA Code & Ethics for combined lines)",
        "examVendor": "PSI",
        "application": "Submit fingerprints via Live Scan and apply through CDI's Sircon/NIPR system",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics) + 8-hour LTC training + 4-hour annuity suitability training",
        "keyStatutes": "CIC §§1621 – 1665 (licensing), §790.03 (unfair practices), §1861.01 (Proposition 103), §§1063 (CIGA) and 1067.02 (life/health guaranty funds)",
        "uniqueFeatures": "Proposition 103 requires prior approval for most P/C rates; dedicated Fraud Division; California Earthquake Authority and CA FAIR Plan participation required",
        "sources": "CDI – Applicant information; California Insurance Code",
        "website": "https://www.insurance.ca.gov/",
        "licensingUrl": "https://www.insurance.ca.gov/0200-industry/0200-prod-licensing/0100-applicant-info/",
        "statuteUrl": "https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=INS",
        "fraudUrl": "https://www.insurance.ca.gov/0300-fraud/0100-fraud-division-overview/",
        "applicationPortal": "CDI via Sircon/NIPR as directed on CDI site",
        "examInfo": "PSI (see PSI CA Insurance handbook linked from CDI)",
        "divisions": "Regional offices throughout California; Fraud Division; Consumer Services",
        "statuteReferences": {
            "licensing": "CIC §1621 et seq.",
            "producerLicensing": "CIC §§1625–1665",
            "unfairPractices": "CIC §790.03",
            "guarantyCIGA": "CIC §1063",
            "guarantyLifeHealth": "CIC §1067.02",
            "ratesProp103": "CIC §1861.01 (Proposition 103)",
            "adjusters": "CIC §14022 et seq.",
            "appointments": "CIC §1704"
        },
        "officialSources": [
            {
                "title": "CDI applicant information",
                "url": "https://www.insurance.ca.gov/0200-industry/0200-prod-licensing/0100-applicant-info/"
            },
            {
                "title": "PSI CA Insurance handbook (linked from CDI)",
                "url": "https://www.insurance.ca.gov/0200-industry/0200-prod-licensing/0100-applicant-info/"
            },
            {
                "title": "California Insurance Code",
                "url": "https://leginfo.legislature.ca.gov/faces/codesTOCSelected.xhtml?tocCode=INS"
            },
            {
                "title": "Fraud Division Overview",
                "url": "https://www.insurance.ca.gov/0300-fraud/0100-fraud-division-overview/"
            }
        ]
    },
    "Colorado": {
        "authority": "Colorado Division of Insurance, Department of Regulatory Agencies (DORA)",
        "address": "1560 Broadway, Suite 850, Denver, CO 80202",
        "phone": "(303) 894‑7499",
        "director": "Insurance Commissioner Michael Conway",
        "ageRequirement": "18+",
        "residency": "Colorado residents required",
        "preLicensing": "Required",
        "examVendor": "Pearson VUE (OnVUE remote available)",
        "application": "Via Sircon or NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 ethics)",
        "keyStatutes": "CRS §§10‑2‑401 – 10‑2‑704 (licensing), §§10‑3‑1101 – 1104 (unfair practices), §§10‑4‑401 (P/C guaranty), 10‑20‑103 (life/health guaranty)",
        "uniqueFeatures": "Surplus-lines brokers must post $20,000 bond; recent travel insurance oversight updates; NAIC best-interest annuity standard adopted",
        "sources": "Colorado DOI – Producer licensing; CRS Title 10",
        "website": "https://doi.colorado.gov/",
        "licensingUrl": "https://doi.colorado.gov/insurance-industry/for-producers/agents",
        "statuteUrl": "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-10.pdf",
        "regulationsUrl": "https://doi.colorado.gov/statutes-regulations-bulletins/colorado-insurance-regulations",
        "leadershipUrl": "https://doi.colorado.gov/",
        "applicationPortal": "Sircon or NIPR",
        "examInfo": "Pearson VUE (OnVUE remote available)",
        "divisions": "Public adjusters only (no independent/company adjuster license)",
        "statuteReferences": {
            "licensing": "CRS §§10-2-401–10-2-704",
            "licenseRequired": "CRS §10-2-104 et seq.",
            "unfairPractices": "CRS §§10-3-1101–1104",
            "guarantyPC": "CRS §§10-4-401",
            "guarantyLife": "CRS §10-20-103",
            "ratesForms": "CRS §10-4-401 and related; health §10-16-107",
            "appointments": "CRS §10-2-416"
        },
        "officialSources": [
            {
                "title": "Producer/agent hub",
                "url": "https://doi.colorado.gov/insurance-industry/for-producers/agents"
            },
            {
                "title": "Colorado Insurance Regulations",
                "url": "https://doi.colorado.gov/statutes-regulations-bulletins/colorado-insurance-regulations"
            },
            {
                "title": "CRS Title 10 (Insurance) PDF",
                "url": "https://leg.colorado.gov/sites/default/files/images/olls/crs2024-title-10.pdf"
            },
            {
                "title": "Pearson VUE CO page/handbook",
                "url": "https://doi.colorado.gov/insurance-industry/for-producers/agents"
            }
        ]
    },
    "Connecticut": {
        "authority": "Connecticut Insurance Department (CID)",
        "address": "153 Market St., 7th Floor, Hartford, CT 06103",
        "phone": "(860) 297‑3800",
        "director": "Insurance Commissioner Andrew N. Mais",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required (approved providers)",
        "examVendor": "Pearson VUE",
        "application": "Via NIPR/SBS, submit fingerprints as required",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (including 3 hours ethics)",
        "keyStatutes": "CGS §§38a‑702 – 38a‑782 (licensing), §§38a‑815 – 38a‑816 (unfair practices), §§38a‑838 (P/C guaranty), 38a‑860 (life/health guaranty)",
        "uniqueFeatures": "Requires rate and form approval; separate lines for variable contracts requiring FINRA registration",
        "sources": "CID – Producer licensing; Connecticut General Statutes"
    },
    "Delaware": {
        "authority": "Delaware Department of Insurance",
        "address": "503 Carr Rd., Suite 303, Wilmington, DE 19809",
        "phone": "(800) 282‑8611",
        "director": "Insurance Commissioner Trinidad Navarro",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Not required",
        "examVendor": "Pearson VUE",
        "application": "Electronically via NIPR, submit fingerprints and pay fees",
        "appointments": "Required; bail-bond producers must post $50,000 bond",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "18 Del. C. §1701 – 1721 (licensing), §2301 – 2328 (unfair practices), §§4201 – 4239 (P/C guaranty), §§4401 – 4442 (life/health guaranty)",
        "uniqueFeatures": "Leading captive domicile; separate Bureau of Captive & Financial Insurance Products; Fraud Prevention Bureau and Consumer Services Division",
        "sources": "Delaware DOI – Licensing & renewal; Delaware Code Title 18"
    },
    "Idaho": {
        "authority": "Idaho Department of Insurance",
        "address": "700 W State St., 3rd Floor, Boise, ID 83720",
        "phone": "(208) 334‑4250",
        "director": "Director Dean L. Cameron",
        "ageRequirement": "Not specified",
        "residency": "Fingerprinting required only for residents",
        "preLicensing": "Not required",
        "examVendor": "PSI",
        "application": "Residents via NIPR with fingerprints; nonresidents via NIPR without exam",
        "appointments": "Required for each insurer",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "Idaho Code §41‑1003 – 1016 (licensing), §41‑1301 – 1338 (unfair practices), §41‑3601 – 3617 (P/C guaranty), §41‑4301 – 4317 (life/health guaranty)",
        "uniqueFeatures": "DOI also administers state fire marshal duties; fingerprinting within six months of application; exam results valid 180 days, no attempt limit",
        "sources": "Idaho DOI – Licensing FAQ; Idaho Code Title 41"
    },
    "Illinois": {
        "authority": "Illinois Department of Insurance",
        "address": "115 S LaSalle St., 13th Floor, Chicago, IL 60603 and 320 W Washington St., Springfield, IL 62767",
        "phone": "(312) 814‑2420",
        "director": "Director Ann Gillespie",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "20 hours per line (at least 7.5 classroom hours)",
        "examVendor": "Pearson VUE (two-part exam)",
        "application": "Wait five days after passing, then apply electronically via NIPR",
        "appointments": "Required; surety bond $2,500-5% of premiums (max $50,000) for non-appointed insurers",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "215 ILCS 5/500‑15 – 90 (licensing), §§5/154.6 and 5/424 (unfair practices), §§5/531.01 – 5/545.08 (life/health guaranty), §§5/534.01 – 5/545.05 (P/C guaranty)",
        "uniqueFeatures": "One-time 3-hour NFIP flood course required; 3 hours classroom ethics required; producers must report administrative actions within 30 days",
        "sources": "IDOI – Resident producer licensing; Illinois Insurance Code"
    },
    "Indiana": {
        "authority": "Indiana Department of Insurance",
        "address": "311 W Washington St., Suite 103, Indianapolis, IN 46204",
        "phone": "(317) 232‑2385",
        "director": "Commissioner Holly Williams Lambert (appointed Oct 2024)",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required for each major line (approved providers listed by IDOI)",
        "examVendor": "Pearson VUE at Ivy Tech campuses and remote",
        "application": "Via NIPR or Sircon, pay $40 fee",
        "appointments": "Required by each insurer",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "IC §§27‑1‑15.6‑3 – 32 (licensing), IC §27‑4‑1‑4 (unfair practices), §§27‑8‑8 (life/health guaranty), 27‑6‑8 (P/C guaranty)",
        "uniqueFeatures": "Title producers need 7 CE hours (4 classroom); temporary licenses for surviving family members of deceased producers",
        "sources": "Indiana DOI – Resident licensing; Indiana Code"
    },
    "Iowa": {
        "authority": "Iowa Insurance Division",
        "address": "1963 Bell Avenue, Des Moines, IA",
        "phone": "(877) 955‑1212",
        "director": "Commissioner Doug Ommen (appointed Jan 2017)",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Not required",
        "examVendor": "Pearson VUE",
        "application": "Via NIPR, $50 fee",
        "appointments": "Required; variable-life/annuity producers need FINRA Series 6/7 and 63/66",
        "ceHours": "36 hours every 3 years (3 hours ethics)",
        "keyStatutes": "Iowa Code §522B.2 – 522B.18 (licensing), §507B.3 (unfair practices), §§515B.3 (P/C guaranty), 508C.5 (life/health guaranty)",
        "uniqueFeatures": "One-time 4-hour annuity suitability course; adjuster licensing only for crop hail; exam results valid 90 days",
        "sources": "Iowa Insurance Division – Producer licensing; Iowa Code"
    },
    "Kansas": {
        "authority": "Kansas Insurance Department",
        "address": "1300 SW Arrowhead Road, Topeka, KS 66604",
        "phone": "(785) 296‑3071",
        "director": "Commissioner Vicki Schmidt",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required for major lines",
        "examVendor": "Pearson VUE",
        "application": "Tax clearance from Department of Revenue, fingerprinting with waiver form, Uniform Application via NIPR",
        "appointments": "Required",
        "ceHours": "18 hours every 2 years (3 hours ethics); title producers 4 hours; crop producers 2 hours",
        "keyStatutes": "KSA §40‑4903 – §40‑4912 (licensing), §40‑2404 (unfair practices), §§40‑2903 (P/C guaranty), 40‑3003 (life/health guaranty)",
        "uniqueFeatures": "One-time 3-hour NFIP flood course; updated annuity 'Best Interest' training rules; tax clearance required",
        "sources": "Kansas Insurance Department – Producer licensing; Kansas CE page"
    },
    "Maine": {
        "authority": "Maine Bureau of Insurance, Department of Professional & Financial Regulation",
        "address": "76 Northern Ave., Gardiner, ME 04345",
        "phone": "(800) 300‑5000",
        "director": "Superintendent Bob Carey (as of 2024)",
        "ageRequirement": "Not specified",
        "residency": "Non-resident licenses perpetual, no renewal fee",
        "preLicensing": "Not required for standard producer lines",
        "examVendor": "Pearson VUE",
        "application": "Apply to bureau and pay fees",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); renewals at end of birth month on odd/even year cycle",
        "keyStatutes": "24‑A M.R.S. §§1401 – 1498 (licensing), §§2155 – 2159 (unfair practices), §§4432 (P/C guaranty), 4621 (life/health guaranty)",
        "uniqueFeatures": "Cybersecurity rules enforced; at least half of CE hours must be classroom or interactive training",
        "sources": "Maine Bureau of Insurance – CE FAQs; 24‑A M.R.S. Title 24‑A"
    },
    "Michigan": {
        "authority": "Michigan Department of Insurance & Financial Services (DIFS)",
        "address": "530 W Allegan St., 7th Floor, Lansing, MI 48933",
        "phone": "(877) 999‑6442",
        "director": "Director Anita G. Fox",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required as per MCL §500.1204",
        "examVendor": "PSI",
        "application": "State and FBI fingerprinting required, file via NIPR with fees",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "MCL §§500.1201 – 1231 (licensing), §§500.2001 – 2027 (unfair practices), §§500.7701 – 500.7745 (life/health guaranty), §§500.7901 – 500.7997 (P/C guaranty)",
        "uniqueFeatures": "DIFS regulates banks, credit unions, and consumer finance; approved pre-licensing providers; NAIC Best Interest training for annuities",
        "sources": "Michigan DIFS – How to become licensed; Michigan Insurance Code"
    },
    "Minnesota": {
        "authority": "Minnesota Department of Commerce",
        "address": "85 7th Place E., Suite 280, St Paul, MN 55101",
        "phone": "(651) 539‑1600",
        "director": "Commissioner Grace Arnold",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "20 hours per line (at least 50% classroom or interactive)",
        "examVendor": "PSI",
        "application": "Fingerprints required at test centers, file via Sircon or NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); at least 12 hours must not be company-sponsored",
        "keyStatutes": "Minn. Stat. §§60K.31 – 60K.48 (licensing), §§72A.02 – 72A.20 (unfair practices), §§60C.01 – 60C.22 (P/C guaranty), §§61B.18 – 61B.32 (life/health guaranty)",
        "uniqueFeatures": "Cybersecurity program requirement (Ch. 60A.985 – 60A.9858); Enforcement Division monitors 20+ industries",
        "sources": "Minnesota Commerce – Resident producer licensing; Legislative Auditor report"
    },
    "Mississippi": {
        "authority": "Mississippi Insurance Department",
        "address": "PO Box 79, Jackson, MS 39205",
        "phone": "(601) 359‑3569",
        "director": "Commissioner Mike Chaney",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required (except life-only producers after HB 819 in 2024)",
        "examVendor": "Pearson VUE",
        "application": "Via Sircon and pay fees",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); producers 65+ with 25+ years licensure exempt",
        "keyStatutes": "MCA §§83‑17‑1 – 83‑17‑75 (licensing), §§83‑5‑33 – 83‑5‑35 (unfair practices), §§83‑23‑101 – 83‑23‑137 (P/C guaranty), §§83‑23‑201 – 83‑23‑221 (life/health guaranty)",
        "uniqueFeatures": "Cybersecurity Law (Sections 83‑5‑801 – 83‑5‑825); life-only producers exempt from pre-licensing as of July 2024; producers 65+ may be exempt from CE",
        "sources": "Mississippi Insurance Department – Licensing; Mississippi Code"
    },
    "Missouri": {
        "authority": "Missouri Department of Commerce & Insurance (DCI)",
        "address": "301 W High Street, Room 530, Jefferson City, MO 65101",
        "phone": "(573) 751‑4126",
        "director": "Director Angela L. Nelson (appointed March 1 2025)",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Not required for major lines",
        "examVendor": "Pearson VUE",
        "application": "Via NIPR/Sircon, pay $100 fee",
        "appointments": "Required",
        "ceHours": "16 hours every 2 years (3 hours ethics)",
        "keyStatutes": "RSMo §§375.014 – 375.041 (licensing), §375.936 (unfair practices), §§375.771 (P/C guaranty), 376.715 (life/health guaranty)",
        "uniqueFeatures": "Only 16 hours CE for major lines (shorter than many states); title producers need 8 hours CE and $10,000 surety bond",
        "sources": "Missouri DCI – Resident producer licensing; Missouri mission"
    },
    "Nebraska": {
        "authority": "Nebraska Department of Insurance",
        "address": "PO Box 95087, Lincoln, NE 68509‑5087",
        "phone": "(402) 471‑2201",
        "director": "Director Eric Dunning",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Not required",
        "examVendor": "PSI",
        "application": "Via NIPR and pay fees; processing takes 3–5 days",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "Neb. Rev. Stat. §§44‑4053 – 44‑4067 (licensing), §44‑1520 – 44‑1530 (unfair practices), §§44‑2391 (P/C guaranty), 44‑3005 (life/health guaranty)",
        "uniqueFeatures": "One-time training for annuity or long-term-care products; separate CE modules for flood, LTC and annuity suitability",
        "sources": "Nebraska DOI – Producer licensing; Nebraska statutes"
    },
    "New Jersey": {
        "authority": "New Jersey Department of Banking & Insurance (DOBI) – Division of Insurance",
        "address": "20 West State Street, Trenton, NJ 08625",
        "phone": "(609) 292‑5360",
        "director": "Commissioner Justin Zimmerman (as of 2025)",
        "ageRequirement": "Not specified",
        "residency": "Fingerprints via Live Scan for residents",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Via NIPR or paper (paper adds fee)",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); public adjusters 15 hours",
        "keyStatutes": "N.J.S.A. §§17:22A‑26 – 63 (licensing), §§17B:30‑1 – 14 (unfair practices), §§17:30A‑1 – 22 (P/C guaranty), §§17B:32A‑1 – 18 (life/health guaranty)",
        "uniqueFeatures": "Trade name approval for fictitious names; long-term care and annuity suitability training required",
        "sources": "NJ DOBI – Insurance licensing; NJ statutes"
    },
    "New York": {
        "authority": "New York State Department of Financial Services (DFS)",
        "address": "1 State Street, New York, NY 10004",
        "phone": "(800) 342‑3736",
        "director": "Superintendent Adrienne A. Harris",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required (hours vary by line)",
        "examVendor": "PSI",
        "application": "Fingerprints via IdentoGO, apply through DFS NY LINX portal",
        "appointments": "Required",
        "ceHours": "15 hours every 2 years (1-hour flood course for P/C producers)",
        "keyStatutes": "N.Y. Ins. Law §§2102 – 2134 (licensing), §2402 (unfair practices), Articles 76 (P/C guaranty), 77 (life/health guaranty)",
        "uniqueFeatures": "DFS supervises banking and financial institutions; 4-hour annuity suitability course; 8-hour initial and 4-hour ongoing LTC training",
        "sources": "DFS – Agents & Brokers; New York Insurance Law"
    },
    "North Carolina": {
        "authority": "North Carolina Department of Insurance",
        "address": "1201 Mail Service Center, Raleigh, NC 27699‑1201",
        "phone": "(855) 408‑1212",
        "director": "Commissioner Mike Causey",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required for major lines; not required for adjusters",
        "examVendor": "Pearson VUE",
        "application": "Submit fingerprints and apply via NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); adjusters 24 hours for P/C, 12 hours for limited lines",
        "keyStatutes": "NCGS §§58‑33‑25 – 58‑33‑140 (licensing), §58‑63‑5 (unfair practices), §§58‑48‑15 and 58‑62‑20 (guaranty associations)",
        "uniqueFeatures": "DOI oversees fire and rescue services; separate Office of State Fire Marshal; adjuster licensing separate from producer licensing",
        "sources": "NCDOI – Agent & adjuster licensing; NCGS Chapter 58",
        "website": "https://www.ncdoi.gov/",
        "licensingUrl": "https://www.ncdoi.gov/agent-licensing",
        "statuteUrl": "https://www.ncleg.gov/Laws/GeneralStatutes",
        "guarantyUrl": "https://www.ncdoi.gov/consumers/insurance-guaranty-associations",
        "aboutUrl": "https://www.ncdoi.gov/about-ncdoi",
        "applicationPortal": "NIPR",
        "examInfo": "Pearson VUE (adjusters exempt from exam)",
        "divisions": "Agent Licensing; Consumer Services; Fire & Rescue; State Fire Marshal",
        "statuteReferences": {
            "licensing": "NCGS §§58-33-25–58-33-140",
            "unfairPractices": "NCGS §58-63-5",
            "guarantyAssociations": "NCGS §§58-48-15, 58-62-20",
            "appointments": "Required by each insurer",
            "adjusters": "NCGS Chapter 58 Article 33"
        },
        "officialSources": [
            {
                "title": "NCDOI home",
                "url": "https://www.ncdoi.gov/"
            },
            {
                "title": "About NC Department of Insurance",
                "url": "https://www.ncdoi.gov/about-ncdoi"
            },
            {
                "title": "Agent Licensing",
                "url": "https://www.ncdoi.gov/agent-licensing"
            },
            {
                "title": "NC General Statutes",
                "url": "https://www.ncleg.gov/Laws/GeneralStatutes"
            },
            {
                "title": "Insurance Guaranty Associations",
                "url": "https://www.ncdoi.gov/consumers/insurance-guaranty-associations"
            }
        ]
    },
    "North Dakota": {
        "authority": "North Dakota Insurance Department",
        "address": "600 E Boulevard Ave., Bismarck, ND 58505",
        "phone": "(701) 328‑2440",
        "director": "Commissioner Jon Godfread",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Not required",
        "examVendor": "Pearson VUE",
        "application": "Via NIPR; fingerprints may be required",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics); even-numbered year renewals complete CE by April 30",
        "keyStatutes": "NDCC §§26.1‑26‑03 – 26.1‑26‑31 (licensing), §26.1‑04‑03 (unfair practices), §§26.1‑32‑01 (P/C guaranty), 26.1‑38‑01 (life/health guaranty)",
        "uniqueFeatures": "Specialized training for long-term care or annuity products; license suspension for CE failure",
        "sources": "ND Insurance Department – Producer licensing; NDCC Title 26.1",
        "website": "https://www.insurance.nd.gov/",
        "licensingUrl": "https://www.insurance.nd.gov/producer-licensing",
        "statuteUrl": "https://www.legis.nd.gov/cencode/t26-1c26-1.pdf",
        "guarantyUrl": "https://www.insurance.nd.gov/guaranty-funds",
        "aboutUrl": "https://www.insurance.nd.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "Pearson VUE (no exam required for major lines)",
        "divisions": "Producer Licensing; Consumer Services; Financial Examination; Market Regulation",
        "statuteReferences": {
            "licensing": "NDCC §§26.1-26-03–26.1-26-31",
            "unfairPractices": "NDCC §26.1-04-03",
            "guarantyPC": "NDCC §§26.1-32-01",
            "guarantyLife": "NDCC §26.1-38-01",
            "appointments": "Required by each insurer"
        },
        "officialSources": [
            {
                "title": "ND Insurance Department home",
                "url": "https://www.insurance.nd.gov/"
            },
            {
                "title": "About the Department",
                "url": "https://www.insurance.nd.gov/about"
            },
            {
                "title": "Producer Licensing",
                "url": "https://www.insurance.nd.gov/producer-licensing"
            },
            {
                "title": "NDCC Title 26.1 (Insurance)",
                "url": "https://www.legis.nd.gov/cencode/t26-1c26-1.pdf"
            },
            {
                "title": "Guaranty Funds",
                "url": "https://www.insurance.nd.gov/guaranty-funds"
            }
        ]
    },
    "Ohio": {
        "authority": "Ohio Department of Insurance",
        "address": "50 W Town Street, Suite 300, Columbus, OH 43215",
        "phone": "(614) 644‑2658",
        "director": "Director Judith French (as of 2025)",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "BCI & FBI fingerprints, apply through NIPR/Sircon",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "ORC §§3905.02 – 3905.22 (licensing), §§3901.19 – 3901.27 (unfair practices), §§3955.01 – 3955.19 (P/C guaranty), §§3956.01 – 3956.18 (life/health guaranty)",
        "uniqueFeatures": "Prohibits credit scores as sole underwriting factor; public adjusters need $1,000 bond and 10 CE hours; no independent/company adjuster licensing",
        "sources": "Ohio Department of Insurance – Licensing info; ORC Title 39",
        "website": "https://insurance.ohio.gov/",
        "licensingUrl": "https://insurance.ohio.gov/industry/producer-licensing",
        "statuteUrl": "https://codes.ohio.gov/ohio-revised-code/title-39",
        "guarantyUrl": "https://insurance.ohio.gov/consumer/guaranty-associations",
        "aboutUrl": "https://insurance.ohio.gov/about-odi",
        "applicationPortal": "NIPR/Sircon",
        "examInfo": "PSI (required for producer licensing)",
        "divisions": "Producer Licensing; Consumer Services; Financial Examination; Market Conduct",
        "statuteReferences": {
            "licensing": "ORC §§3905.02–3905.22",
            "unfairPractices": "ORC §§3901.19–3901.27",
            "guarantyPC": "ORC §§3955.01–3955.19",
            "guarantyLife": "ORC §§3956.01–3956.18",
            "appointments": "Required by each insurer",
            "adjusters": "Public adjusters only (bond required)"
        },
        "officialSources": [
            {
                "title": "Ohio Department of Insurance home",
                "url": "https://insurance.ohio.gov/"
            },
            {
                "title": "About ODI",
                "url": "https://insurance.ohio.gov/about-odi"
            },
            {
                "title": "Producer Licensing",
                "url": "https://insurance.ohio.gov/industry/producer-licensing"
            },
            {
                "title": "Ohio Revised Code Title 39",
                "url": "https://codes.ohio.gov/ohio-revised-code/title-39"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://insurance.ohio.gov/consumer/guaranty-associations"
            }
        ]
    },
    "Oklahoma": {
        "authority": "Oklahoma Insurance Department",
        "address": "400 NE 50th St., Oklahoma City, OK 73105",
        "phone": "(405) 521‑2828",
        "director": "Commissioner Glen Mulready",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Wait 3 business days after passing, then apply via NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "36 O.S. §§1435.3 – 1435.23 (licensing), §1204 (unfair practices), §§3636 (P/C guaranty), 2021 (life/health guaranty)",
        "uniqueFeatures": "Exam scores valid 2 years; 2-hour annuity best-interest training; separate LTC and flood courses",
        "sources": "Oklahoma Insurance Department – Licensing & Education; Oklahoma statutes",
        "website": "https://www.oid.ok.gov/",
        "licensingUrl": "https://www.oid.ok.gov/producers/licensing",
        "statuteUrl": "https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=69550",
        "guarantyUrl": "https://www.oid.ok.gov/consumers/guaranty-associations",
        "aboutUrl": "https://www.oid.ok.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (wait 3 business days after passing before applying)",
        "divisions": "Producer Licensing; Consumer Protection; Financial Regulation; Market Conduct",
        "statuteReferences": {
            "licensing": "36 O.S. §§1435.3–1435.23",
            "unfairPractices": "36 O.S. §1204",
            "guarantyPC": "36 O.S. §§3636",
            "guarantyLife": "36 O.S. §2021",
            "appointments": "Required by each insurer",
            "examValidity": "Scores valid for 2 years"
        },
        "officialSources": [
            {
                "title": "Oklahoma Insurance Department home",
                "url": "https://www.oid.ok.gov/"
            },
            {
                "title": "About OID",
                "url": "https://www.oid.ok.gov/about"
            },
            {
                "title": "Producer Licensing",
                "url": "https://www.oid.ok.gov/producers/licensing"
            },
            {
                "title": "Oklahoma Statutes Title 36",
                "url": "https://www.oscn.net/applications/oscn/DeliverDocument.asp?CiteID=69550"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://www.oid.ok.gov/consumers/guaranty-associations"
            }
        ]
    },
    "Oregon": {
        "authority": "Oregon Division of Financial Regulation, Department of Consumer & Business Services",
        "address": "350 Winter St. NE, Salem, OR 97301",
        "phone": "(503) 947‑7980",
        "director": "Not specified",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "Pearson VUE",
        "application": "Applications and fingerprints via NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "ORS §§744.051 – 744.098 (licensing), §746.230 (unfair practices), §§735.500 – 735.650 (P/C guaranty), §§734.010 – 734.710 (life/health guaranty)",
        "uniqueFeatures": "3-hour NFIP course for flood insurance; 8-hour initial and 4-hour ongoing LTC courses",
        "sources": "Oregon DFR – Licensing; Oregon Revised Statutes",
        "website": "https://dfr.oregon.gov/",
        "licensingUrl": "https://dfr.oregon.gov/business/ins-opp/licensing",
        "statuteUrl": "https://www.oregonlegislature.gov/bills_laws/ors/ors744.html",
        "guarantyUrl": "https://dfr.oregon.gov/consumers/insurance/pages/guaranty-association.aspx",
        "aboutUrl": "https://dfr.oregon.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "Pearson VUE (required for producer licensing)",
        "divisions": "Insurance Regulation; Consumer Protection; Financial Regulation; Market Conduct",
        "statuteReferences": {
            "licensing": "ORS §§744.051–744.098",
            "unfairPractices": "ORS §746.230",
            "guarantyPC": "ORS §§735.500–735.650",
            "guarantyLife": "ORS §§734.010–734.710",
            "appointments": "Required by each insurer",
            "floodInsurance": "3-hour NFIP course required"
        },
        "officialSources": [
            {
                "title": "Oregon DFR home",
                "url": "https://dfr.oregon.gov/"
            },
            {
                "title": "About DFR",
                "url": "https://dfr.oregon.gov/about"
            },
            {
                "title": "Insurance Producer Licensing",
                "url": "https://dfr.oregon.gov/business/ins-opp/licensing"
            },
            {
                "title": "Oregon Revised Statutes Chapter 744",
                "url": "https://www.oregonlegislature.gov/bills_laws/ors/ors744.html"
            },
            {
                "title": "Guaranty Association",
                "url": "https://dfr.oregon.gov/consumers/insurance/pages/guaranty-association.aspx"
            }
        ]
    },
    "Pennsylvania": {
        "authority": "Pennsylvania Insurance Department",
        "address": "1345 Strawberry Square, Harrisburg, PA 17120",
        "phone": "(717) 787‑2317",
        "director": "Commissioner Michael Humphreys",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Submit fingerprints and apply through NIPR",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "40 Pa.C.S. §§631.1 – 631.20 (licensing), §§626.1 – 626.69 (unfair practices), §§991-A (P/C guaranty), 991.1-A (life/health guaranty)",
        "uniqueFeatures": "Mandatory continuing education audit system; separate flood and LTC courses",
        "sources": "Pennsylvania Insurance Department – Producer licensing; Pennsylvania statutes",
        "website": "https://www.insurance.pa.gov/",
        "licensingUrl": "https://www.insurance.pa.gov/companies-providers/producer-licensing/",
        "statuteUrl": "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=40",
        "guarantyUrl": "https://www.insurance.pa.gov/coverage/consumer-info/pages/guaranty-associations.aspx",
        "aboutUrl": "https://www.insurance.pa.gov/About/Pages/default.aspx",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (required for producer licensing)",
        "divisions": "Producer Licensing; Consumer Services; Market Conduct; Financial Regulation",
        "statuteReferences": {
            "licensing": "40 Pa.C.S. §§631.1–631.20",
            "unfairPractices": "40 Pa.C.S. §§626.1–626.69",
            "guarantyPC": "40 Pa.C.S. §991-A",
            "guarantyLife": "40 Pa.C.S. §991.1-A",
            "appointments": "Required by each insurer",
            "auditSystem": "Mandatory CE audit system"
        },
        "officialSources": [
            {
                "title": "Pennsylvania Insurance Department home",
                "url": "https://www.insurance.pa.gov/"
            },
            {
                "title": "About PID",
                "url": "https://www.insurance.pa.gov/About/Pages/default.aspx"
            },
            {
                "title": "Producer Licensing",
                "url": "https://www.insurance.pa.gov/companies-providers/producer-licensing/"
            },
            {
                "title": "Pennsylvania Code Title 40",
                "url": "https://www.legis.state.pa.us/cfdocs/legis/LI/consCheck.cfm?txtType=HTM&ttl=40"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://www.insurance.pa.gov/coverage/consumer-info/pages/guaranty-associations.aspx"
            }
        ]
    },
    "South Carolina": {
        "authority": "South Carolina Department of Insurance",
        "address": "1201 Main St., Suite 1000, Columbia, SC 29201",
        "phone": "(803) 737‑6160",
        "director": "Director Ray Farmer",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Via NIPR, submit fingerprints",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "S.C. Code §§38‑43‑10 – 38‑43‑160 (licensing), §38‑55‑60 (unfair practices), §§38‑31‑10 (P/C guaranty), 38‑37‑10 (life/health guaranty)",
        "uniqueFeatures": "Wind and Hail Underwriting Association for coastal properties; separate flood insurance training",
        "sources": "SC Department of Insurance – Producer licensing; South Carolina Code",
        "website": "https://doi.sc.gov/",
        "licensingUrl": "https://doi.sc.gov/producer-licensing",
        "statuteUrl": "https://www.scstatehouse.gov/code/t38c043.php",
        "guarantyUrl": "https://doi.sc.gov/consumer/guaranty-associations",
        "aboutUrl": "https://doi.sc.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (required for producer licensing)",
        "divisions": "Producer Licensing; Consumer Services; Market Regulation; Coastal Property",
        "statuteReferences": {
            "licensing": "S.C. Code §§38-43-10–38-43-160",
            "unfairPractices": "S.C. Code §38-55-60",
            "guarantyPC": "S.C. Code §38-31-10",
            "guarantyLife": "S.C. Code §38-37-10",
            "appointments": "Required by each insurer",
            "coastalProperties": "Wind and Hail Underwriting Association"
        },
        "officialSources": [
            {
                "title": "SC Department of Insurance home",
                "url": "https://doi.sc.gov/"
            },
            {
                "title": "About SC DOI",
                "url": "https://doi.sc.gov/about"
            },
            {
                "title": "Producer Licensing",
                "url": "https://doi.sc.gov/producer-licensing"
            },
            {
                "title": "South Carolina Code Title 38",
                "url": "https://www.scstatehouse.gov/code/t38c043.php"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://doi.sc.gov/consumer/guaranty-associations"
            }
        ]
    },
    "Tennessee": {
        "authority": "Tennessee Department of Commerce & Insurance",
        "address": "500 James Robertson Pkwy., Nashville, TN 37243",
        "phone": "(615) 741‑2241",
        "director": "Commissioner Carter Lawrence",
        "ageRequirement": "Not specified",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Via NIPR with fingerprints",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "Tenn. Code Ann. §§56‑6‑101 – 56‑6‑122 (licensing), §56‑8‑104 (unfair practices), §§56‑12‑101 (P/C guaranty), 56‑7‑101 (life/health guaranty)",
        "uniqueFeatures": "Combined Department of Commerce & Insurance; separate courses for flood and long-term care",
        "sources": "Tennessee Department of Commerce & Insurance – Licensing; Tennessee Code",
        "website": "https://www.tn.gov/commerce/insurance.html",
        "licensingUrl": "https://www.tn.gov/commerce/insurance/licensing.html",
        "statuteUrl": "https://www.tn.gov/commerce/insurance/legal.html",
        "guarantyUrl": "https://www.tn.gov/commerce/insurance/consumers/guaranty-associations.html",
        "aboutUrl": "https://www.tn.gov/commerce/about.html",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (required for producer licensing)",
        "divisions": "Insurance Division; Commerce Division; Regulatory Boards; Fire Prevention",
        "statuteReferences": {
            "licensing": "Tenn. Code Ann. §§56-6-101–56-6-122",
            "unfairPractices": "Tenn. Code Ann. §56-8-104",
            "guarantyPC": "Tenn. Code Ann. §56-12-101",
            "guarantyLife": "Tenn. Code Ann. §56-7-101",
            "appointments": "Required by each insurer",
            "combinedDept": "Commerce & Insurance combined"
        },
        "officialSources": [
            {
                "title": "TN Department of Commerce & Insurance home",
                "url": "https://www.tn.gov/commerce/insurance.html"
            },
            {
                "title": "About the Department",
                "url": "https://www.tn.gov/commerce/about.html"
            },
            {
                "title": "Insurance Licensing",
                "url": "https://www.tn.gov/commerce/insurance/licensing.html"
            },
            {
                "title": "Legal Resources",
                "url": "https://www.tn.gov/commerce/insurance/legal.html"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://www.tn.gov/commerce/insurance/consumers/guaranty-associations.html"
            }
        ]
    },
    "Texas": {
        "authority": "Texas Department of Insurance (TDI)",
        "address": "333 Guadalupe St., Austin, TX 78701",
        "phone": "(512) 804‑4000",
        "director": "Commissioner Cassie Brown",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required (20-40 hours depending on line)",
        "examVendor": "PSI",
        "application": "Via NIPR with background check",
        "appointments": "Required",
        "ceHours": "30 hours every 2 years (2 hours ethics + 3 hours fraud prevention)",
        "keyStatutes": "Tex. Ins. Code §§4001.051 – 4001.204 (licensing), §541.051 (unfair practices), §§462.001 – 462.712 (P/C guaranty), §463.001 – 463.605 (life/health guaranty)",
        "uniqueFeatures": "30 hours CE requirement (highest among states covered); windstorm insurance via TWIA; separate courses for flood, ethics, and fraud prevention",
        "sources": "TDI – General lines agent licensing; Texas Insurance Code",
        "website": "https://www.tdi.texas.gov/",
        "licensingUrl": "https://www.tdi.texas.gov/license/agent/index.html",
        "statuteUrl": "https://statutes.capitol.texas.gov/Docs/IN/htm/IN.4001.htm",
        "guarantyUrl": "https://www.tdi.texas.gov/consumer/guaranty-associations.html",
        "aboutUrl": "https://www.tdi.texas.gov/about/",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (required for producer licensing)",
        "divisions": "Licensing & Registration; Market Conduct; Financial Regulation; Consumer Protection",
        "statuteReferences": {
            "licensing": "Tex. Ins. Code §§4001.051–4001.204",
            "unfairPractices": "Tex. Ins. Code §541.051",
            "guarantyPC": "Tex. Ins. Code §§462.001–462.712",
            "guarantyLife": "Tex. Ins. Code §463.001–463.605",
            "appointments": "Required by each insurer",
            "windstorm": "TWIA windstorm insurance",
            "ceRequirement": "30 hours (highest requirement)"
        },
        "officialSources": [
            {
                "title": "Texas Department of Insurance home",
                "url": "https://www.tdi.texas.gov/"
            },
            {
                "title": "About TDI",
                "url": "https://www.tdi.texas.gov/about/"
            },
            {
                "title": "Agent Licensing",
                "url": "https://www.tdi.texas.gov/license/agent/index.html"
            },
            {
                "title": "Texas Insurance Code",
                "url": "https://statutes.capitol.texas.gov/Docs/IN/htm/IN.4001.htm"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://www.tdi.texas.gov/consumer/guaranty-associations.html"
            }
        ]
    },
    "Utah": {
        "authority": "Utah Insurance Department",
        "address": "4315 S 2700 W, Suite 2300, Taylorsville, UT 84129",
        "phone": "(801) 957‑9200",
        "director": "Commissioner Jonathan T. Pike",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Via NIPR, fingerprints required",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "Utah Code §§31A‑23a‑101 – 31A‑23a‑117 (licensing), §31A‑23‑236 (unfair practices), §§31A‑28‑101 (P/C guaranty), 31A‑28‑201 (life/health guaranty)",
        "uniqueFeatures": "Pre-licensing exam must be taken within 180 days of course completion; annuity suitability training required",
        "sources": "Utah Insurance Department – Producer licensing; Utah Code",
        "website": "https://insurance.utah.gov/",
        "licensingUrl": "https://insurance.utah.gov/licensing/producer-licensing",
        "statuteUrl": "https://le.utah.gov/xcode/Title31A/Chapter23a/31A-23a.html",
        "guarantyUrl": "https://insurance.utah.gov/consumer/guaranty-associations",
        "aboutUrl": "https://insurance.utah.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (must be taken within 180 days of course completion)",
        "divisions": "Producer Licensing; Consumer Services; Market Conduct; Financial Regulation",
        "statuteReferences": {
            "licensing": "Utah Code §§31A-23a-101–31A-23a-117",
            "unfairPractices": "Utah Code §31A-23-236",
            "guarantyPC": "Utah Code §31A-28-101",
            "guarantyLife": "Utah Code §31A-28-201",
            "appointments": "Required by each insurer",
            "examTiming": "180-day exam completion requirement",
            "annuitySuitability": "Required training"
        },
        "officialSources": [
            {
                "title": "Utah Insurance Department home",
                "url": "https://insurance.utah.gov/"
            },
            {
                "title": "About the Department",
                "url": "https://insurance.utah.gov/about"
            },
            {
                "title": "Producer Licensing",
                "url": "https://insurance.utah.gov/licensing/producer-licensing"
            },
            {
                "title": "Utah Code Title 31A",
                "url": "https://le.utah.gov/xcode/Title31A/Chapter23a/31A-23a.html"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://insurance.utah.gov/consumer/guaranty-associations"
            }
        ]
    },
    "West Virginia": {
        "authority": "West Virginia Offices of the Insurance Commissioner",
        "address": "1124 Smith St., Charleston, WV 25301",
        "phone": "(304) 558‑3354",
        "director": "Commissioner Allan L. McVey",
        "ageRequirement": "18+",
        "residency": "Not specified",
        "preLicensing": "Required",
        "examVendor": "PSI",
        "application": "Via NIPR with background check",
        "appointments": "Required",
        "ceHours": "24 hours every 2 years (3 hours ethics)",
        "keyStatutes": "W. Va. Code §§33‑12‑1 – 33‑12‑19 (licensing), §33‑11‑4 (unfair practices), §§33‑26‑1 (P/C guaranty), 33‑26A‑1 (life/health guaranty)",
        "uniqueFeatures": "Combined life and health exam; separate courses for annuity suitability and long-term care",
        "sources": "WV Offices of the Insurance Commissioner – Producer licensing; West Virginia Code",
        "website": "https://www.wvinsurance.gov/",
        "licensingUrl": "https://www.wvinsurance.gov/licensing/producer-licensing",
        "statuteUrl": "http://www.legis.state.wv.us/wvcode/code.cfm?chap=33&art=12",
        "guarantyUrl": "https://www.wvinsurance.gov/consumer/guaranty-associations",
        "aboutUrl": "https://www.wvinsurance.gov/about",
        "applicationPortal": "NIPR",
        "examInfo": "PSI (combined life and health exam available)",
        "divisions": "Producer Licensing; Consumer Services; Market Conduct; Financial Oversight",
        "statuteReferences": {
            "licensing": "W. Va. Code §§33-12-1–33-12-19",
            "unfairPractices": "W. Va. Code §33-11-4",
            "guarantyPC": "W. Va. Code §33-26-1",
            "guarantyLife": "W. Va. Code §33-26A-1",
            "appointments": "Required by each insurer",
            "combinedExam": "Life and health combined exam option",
            "annuitySuitability": "Required training course"
        },
        "officialSources": [
            {
                "title": "WV Offices of the Insurance Commissioner home",
                "url": "https://www.wvinsurance.gov/"
            },
            {
                "title": "About the Insurance Commissioner",
                "url": "https://www.wvinsurance.gov/about"
            },
            {
                "title": "Producer Licensing",
                "url": "https://www.wvinsurance.gov/licensing/producer-licensing"
            },
            {
                "title": "West Virginia Code Chapter 33",
                "url": "http://www.legis.state.wv.us/wvcode/code.cfm?chap=33&art=12"
            },
            {
                "title": "Guaranty Associations",
                "url": "https://www.wvinsurance.gov/consumer/guaranty-associations"
            }
        ]
    }
};

const StateCard = ({ stateName, stateData }: { stateName: string; stateData: any }) => {
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div 
      className="glass hover:scale-[1.01] transition-all duration-700 ease-out p-8 group"
      style={{
        background: `linear-gradient(135deg, 
          rgba(255, 255, 255, 0.15) 0%, 
          rgba(255, 255, 255, 0.08) 30%, 
          rgba(255, 255, 255, 0.05) 50%, 
          rgba(255, 255, 255, 0.08) 70%, 
          rgba(255, 255, 255, 0.15) 100%
        ), linear-gradient(45deg, 
          rgba(180, 100, 255, 0.1) 0%, 
          rgba(0, 255, 255, 0.1) 100%
        )`,
        borderImage: 'linear-gradient(135deg, rgba(0, 255, 255, 0.5), rgba(255, 0, 255, 0.5)) 1',
        borderWidth: '2px',
        borderStyle: 'solid',
        boxShadow: `
          0 0 40px rgba(0, 255, 255, 0.1),
          0 0 80px rgba(255, 0, 255, 0.05),
          0 8px 32px rgba(0, 0, 0, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `
      }}
      data-testid={`state-card-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div 
        className="border-l-4 pl-6 mb-8 relative"
        style={{
          borderImage: 'linear-gradient(180deg, rgba(0, 255, 255, 0.8), rgba(255, 0, 255, 0.8)) 1'
        }}
      >
        <h2 
          className="text-3xl font-bold mb-3 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent group-hover:from-cyan-200 group-hover:to-fuchsia-200 transition-all duration-500"
          style={{
            textShadow: '0 0 20px rgba(0, 255, 255, 0.3), 0 0 40px rgba(255, 0, 255, 0.2)'
          }}
          data-testid={`state-title-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {stateName}
        </h2>
        <div 
          className="text-cyan-300 font-semibold text-lg mb-2"
          style={{
            textShadow: '0 0 15px rgba(0, 255, 255, 0.4)'
          }}
        >
          {stateData.authority}
        </div>
        {stateData.website && (
          <a 
            href={stateData.website} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-glass-secondary inline-flex items-center gap-2 text-sm px-4 py-2 mt-3 hover:scale-105 transition-all duration-300"
            data-testid={`state-website-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ExternalLink className="w-4 h-4" />
            Official Website
          </a>
        )}
      </div>

      <div className="space-y-6">
        {/* Contact Information */}
        <div 
          className="glass p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 20px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-3 text-xl font-bold mb-4 text-cyan-300"
            style={{
              textShadow: '0 0 15px rgba(0, 255, 255, 0.5)'
            }}
          >
            <Building className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.7))' }} />
            Contact Information
          </h3>
          <div className="space-y-4 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-400 mt-1" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 255, 255, 0.6))' }} />
              <span className="text-gray-200 leading-relaxed">{stateData.address}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-cyan-400" style={{ filter: 'drop-shadow(0 0 3px rgba(0, 255, 255, 0.6))' }} />
              <span className="text-gray-200">{stateData.phone}</span>
            </div>
            <div className="text-gray-200">
              <strong className="text-fuchsia-300">Director:</strong> {stateData.director}
            </div>
            {stateData.divisions && (
              <div className="text-gray-200">
                <strong className="text-fuchsia-300">Divisions:</strong> {stateData.divisions}
              </div>
            )}
          </div>
        </div>

        {/* Official Links Section */}
        {(stateData.website || stateData.licensingUrl || stateData.applicationPortal) && (
          <div className="overflow-hidden">
            <button
              onClick={() => toggleSection('officialLinks')}
              className="btn-glass-primary flex items-center justify-between w-full text-lg font-bold mb-4 p-4 hover:scale-[1.02] transition-all duration-500 group"
              style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                textShadow: '0 0 15px rgba(16, 185, 129, 0.5)'
              }}
              data-testid={`toggle-official-links-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <Link2 className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.6))' }} />
                <span className="text-emerald-300 group-hover:text-emerald-200">Official Links & Resources</span>
              </div>
              {expandedSections.officialLinks ? 
                <ChevronUp className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-all duration-300" /> : 
                <ChevronDown className="w-5 h-5 text-emerald-400 group-hover:rotate-180 transition-all duration-300" />
              }
            </button>
            <div 
              className={`transition-all duration-700 ease-out overflow-hidden ${
                expandedSections.officialLinks ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="glass p-6 space-y-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {stateData.licensingUrl && (
                  <div>
                    <a 
                      href={stateData.licensingUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-glass-secondary inline-flex items-center gap-2 text-sm px-4 py-2 hover:scale-105 transition-all duration-300"
                      data-testid={`licensing-url-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Producer Licensing Information
                    </a>
                  </div>
                )}
                {stateData.applicationPortal && (
                  <div className="text-sm text-gray-200">
                    <strong className="text-emerald-300">Application Portal:</strong> {stateData.applicationPortal}
                  </div>
                )}
                {stateData.examInfo && (
                  <div className="text-sm text-gray-200">
                    <strong className="text-emerald-300">Exam Details:</strong> {stateData.examInfo}
                  </div>
                )}
                {stateData.guarantyUrl && (
                  <div>
                    <a 
                      href={stateData.guarantyUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-glass-secondary inline-flex items-center gap-2 text-sm px-4 py-2 hover:scale-105 transition-all duration-300"
                      data-testid={`guaranty-url-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Guaranty Fund Information
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Leadership & Contact Section */}
        {(stateData.director || stateData.leadershipUrl || stateData.aboutUrl) && (
          <div className="overflow-hidden">
            <button
              onClick={() => toggleSection('leadership')}
              className="btn-glass-primary flex items-center justify-between w-full text-lg font-bold mb-4 p-4 hover:scale-[1.02] transition-all duration-500 group"
              style={{
                background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                textShadow: '0 0 15px rgba(147, 51, 234, 0.5)'
              }}
              data-testid={`toggle-leadership-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-6 h-6 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 8px rgba(147, 51, 234, 0.6))' }} />
                <span className="text-purple-300 group-hover:text-purple-200">Leadership & Contact</span>
              </div>
              {expandedSections.leadership ? 
                <ChevronUp className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-all duration-300" /> : 
                <ChevronDown className="w-5 h-5 text-purple-400 group-hover:rotate-180 transition-all duration-300" />
              }
            </button>
            <div 
              className={`transition-all duration-700 ease-out overflow-hidden ${
                expandedSections.leadership ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="glass p-6 space-y-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 0 25px rgba(147, 51, 234, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                <div className="text-sm text-gray-700">
                  <strong>Current Leadership:</strong> {stateData.director}
                </div>
                {stateData.leadershipUrl && (
                  <div>
                    <a href={stateData.leadershipUrl} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-900">
                      <ExternalLink className="w-3 h-3" />
                      Leadership Information
                    </a>
                  </div>
                )}
                {stateData.aboutUrl && (
                  <div>
                    <a href={stateData.aboutUrl} target="_blank" rel="noopener noreferrer" 
                       className="inline-flex items-center gap-1 text-sm text-purple-700 hover:text-purple-900">
                      <ExternalLink className="w-3 h-3" />
                      About the Department
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Statutes & Legal References Section */}
        {(stateData.statuteUrl || stateData.statuteReferences) && (
          <div className="overflow-hidden">
            <button
              onClick={() => toggleSection('statutes')}
              className="btn-glass-primary flex items-center justify-between w-full text-lg font-bold mb-4 p-4 hover:scale-[1.02] transition-all duration-500 group"
              style={{
                background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                textShadow: '0 0 15px rgba(79, 70, 229, 0.5)'
              }}
              data-testid={`toggle-statutes-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-indigo-400 group-hover:text-indigo-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 8px rgba(79, 70, 229, 0.6))' }} />
                <span className="text-indigo-300 group-hover:text-indigo-200">Statutes & Legal References</span>
              </div>
              {expandedSections.statutes ? 
                <ChevronUp className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-all duration-300" /> : 
                <ChevronDown className="w-5 h-5 text-indigo-400 group-hover:rotate-180 transition-all duration-300" />
              }
            </button>
            <div 
              className={`transition-all duration-700 ease-out overflow-hidden ${
                expandedSections.statutes ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="glass p-6 space-y-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 0 25px rgba(79, 70, 229, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {stateData.statuteUrl && (
                  <div>
                    <a 
                      href={stateData.statuteUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-glass-secondary inline-flex items-center gap-2 text-sm px-4 py-2 hover:scale-105 transition-all duration-300"
                      data-testid={`statute-url-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Official State Insurance Statutes
                    </a>
                  </div>
                )}
                {stateData.statuteReferences && (
                  <div className="space-y-3">
                    {Object.entries(stateData.statuteReferences).map(([key, value]) => (
                      <div key={key} className="text-sm text-gray-200">
                        <strong className="capitalize text-indigo-300">{key.replace(/([A-Z])/g, ' $1').trim()}:</strong> {value}
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-sm text-gray-200 pt-4 border-t border-indigo-400/20">
                  <strong className="text-indigo-300">Summary:</strong> {stateData.keyStatutes}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Requirements */}
        <div 
          className="glass p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 20px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-3 text-xl font-bold mb-6 text-green-300"
            style={{
              textShadow: '0 0 15px rgba(34, 197, 94, 0.5)'
            }}
          >
            <CheckCircle className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 5px rgba(34, 197, 94, 0.7))' }} />
            Licensing Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="text-gray-200">
              <strong className="text-green-300">Age:</strong> {stateData.ageRequirement}
            </div>
            <div className="text-gray-200">
              <strong className="text-green-300">Residency:</strong> {stateData.residency}
            </div>
            <div className="text-gray-200">
              <strong className="text-green-300">Pre-licensing:</strong> {stateData.preLicensing}
            </div>
            <div className="text-gray-200">
              <strong className="text-green-300">Exam Vendor:</strong> {stateData.examVendor}
            </div>
          </div>
        </div>

        {/* Application Process */}
        <div 
          className="glass p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-3 text-xl font-bold mb-6 text-purple-300"
            style={{
              textShadow: '0 0 15px rgba(168, 85, 247, 0.5)'
            }}
          >
            <FileText className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 5px rgba(168, 85, 247, 0.7))' }} />
            Application & Appointments
          </h3>
          <div className="text-sm space-y-4">
            <div className="text-gray-200">
              <strong className="text-purple-300">Application:</strong> {stateData.application}
            </div>
            <div className="text-gray-200">
              <strong className="text-purple-300">Appointments:</strong> {stateData.appointments}
            </div>
          </div>
        </div>

        {/* CE Requirements */}
        <div 
          className="glass p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-3 text-xl font-bold mb-6 text-orange-300"
            style={{
              textShadow: '0 0 15px rgba(251, 146, 60, 0.5)'
            }}
          >
            <Clock className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 5px rgba(251, 146, 60, 0.7))' }} />
            Continuing Education
          </h3>
          <div 
            className="glass p-4 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.15) 0%, rgba(255, 255, 255, 0.08) 100%)',
              boxShadow: '0 0 15px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            }}
          >
            <div className="text-lg font-bold text-orange-200" style={{ textShadow: '0 0 10px rgba(251, 146, 60, 0.4)' }}>
              {stateData.ceHours}
            </div>
          </div>
        </div>

        {/* Unique Features */}
        <div 
          className="glass p-6 transition-all duration-500 hover:scale-[1.02]"
          style={{
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 20px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <h3 
            className="flex items-center gap-3 text-xl font-bold mb-6 text-yellow-300"
            style={{
              textShadow: '0 0 15px rgba(245, 158, 11, 0.5)'
            }}
          >
            <Award className="w-6 h-6" style={{ filter: 'drop-shadow(0 0 5px rgba(245, 158, 11, 0.7))' }} />
            Unique Features
          </h3>
          <div 
            className="text-sm text-gray-200 leading-relaxed"
            style={{
              textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
            }}
          >
            {stateData.uniqueFeatures}
          </div>
        </div>

        {/* Source Citations Section */}
        {stateData.officialSources && (
          <div className="overflow-hidden">
            <button
              onClick={() => toggleSection('sources')}
              className="btn-glass-primary flex items-center justify-between w-full text-lg font-bold mb-4 p-4 hover:scale-[1.02] transition-all duration-500 group"
              style={{
                background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                textShadow: '0 0 15px rgba(6, 182, 212, 0.5)'
              }}
              data-testid={`toggle-sources-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="flex items-center gap-3">
                <Archive className="w-6 h-6 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300" style={{ filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.6))' }} />
                <span className="text-cyan-300 group-hover:text-cyan-200">Official Source Citations</span>
              </div>
              {expandedSections.sources ? 
                <ChevronUp className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-all duration-300" /> : 
                <ChevronDown className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-all duration-300" />
              }
            </button>
            <div 
              className={`transition-all duration-700 ease-out overflow-hidden ${
                expandedSections.sources ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div 
                className="glass p-6 space-y-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.1) 0%, rgba(255, 255, 255, 0.03) 100%)',
                  boxShadow: '0 0 25px rgba(6, 182, 212, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
                }}
              >
                {stateData.officialSources.map((source: any, index: number) => (
                  <div key={index}>
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-glass-secondary inline-flex items-center gap-2 text-sm px-4 py-2 hover:scale-105 transition-all duration-300 mb-2"
                      data-testid={`source-link-${index}-${stateName.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <ExternalLink className="w-4 h-4" />
                      {source.title}
                    </a>
                  </div>
                ))}
                <div className="text-xs text-gray-400 pt-4 border-t border-cyan-400/20">
                  <strong className="text-cyan-300">Legacy Sources:</strong> {stateData.sources}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function RegulationsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [filterBy, setFilterBy] = useState("all");

  const tabs = [
    { id: "all", label: "All States", count: Object.keys(statesData).length },
    { id: "search", label: "Search Results", count: 0 },
    { id: "comparison", label: "Quick Comparison", count: 0 }
  ];

  const filterOptions = [
    { id: "all", label: "All States" },
    { id: "no-prelicensing", label: "No Pre-licensing Required" },
    { id: "low-ce", label: "Low CE Hours (≤18)" },
    { id: "high-ce", label: "High CE Hours (≥30)" },
    { id: "psi", label: "PSI Exam Vendor" },
    { id: "pearson", label: "Pearson VUE Exam Vendor" }
  ];

  const filteredStates = useMemo(() => {
    let filtered = Object.entries(statesData);

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(([stateName, stateData]) =>
        stateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stateData.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stateData.director.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stateData.uniqueFeatures.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (filterBy !== "all") {
      filtered = filtered.filter(([stateName, stateData]) => {
        switch (filterBy) {
          case "no-prelicensing":
            return stateData.preLicensing.toLowerCase().includes("not required");
          case "low-ce":
            const lowCeMatch = stateData.ceHours.match(/(\d+)\s*hours/);
            return lowCeMatch && parseInt(lowCeMatch[1]) <= 18;
          case "high-ce":
            const highCeMatch = stateData.ceHours.match(/(\d+)\s*hours/);
            return highCeMatch && parseInt(highCeMatch[1]) >= 30;
          case "psi":
            return stateData.examVendor.toLowerCase().includes("psi");
          case "pearson":
            return stateData.examVendor.toLowerCase().includes("pearson");
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [searchTerm, filterBy]);

  return (
    <div 
      className="min-h-screen relative overflow-hidden"
      style={{
        background: `
          linear-gradient(135deg, 
            hsl(236, 61%, 16%) 0%,
            hsl(225, 15%, 6%) 25%,
            hsl(236, 61%, 16%) 50%,
            hsl(180, 100%, 10%) 75%,
            hsl(310, 100%, 15%) 100%
          )
        `
      }}
    >
      {/* Ambient Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-20 left-10 w-96 h-96 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(0, 255, 255, 0.3) 0%, transparent 70%)'
          }}
        />
        <div 
          className="absolute bottom-32 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255, 0, 255, 0.3) 0%, transparent 70%)'
          }}
        />
      </div>
      
      {/* Header */}
      <div 
        className="relative py-20 overflow-hidden"
        style={{
          background: `
            linear-gradient(135deg, 
              rgba(0, 255, 255, 0.15) 0%, 
              rgba(255, 0, 255, 0.15) 50%,
              rgba(0, 255, 255, 0.15) 100%
            ),
            linear-gradient(45deg, 
              rgba(15, 23, 42, 0.8) 0%, 
              rgba(30, 41, 59, 0.9) 50%, 
              rgba(15, 23, 42, 0.8) 100%
            )
          `,
          backdropFilter: 'blur(40px)',
          borderBottom: '1px solid rgba(0, 255, 255, 0.2)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 0 100px rgba(0, 255, 255, 0.1),
            0 0 200px rgba(255, 0, 255, 0.05)
          `
        }}
      >
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center">
            <h1 
              className="text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent"
              style={{
                textShadow: `
                  0 0 30px rgba(0, 255, 255, 0.5),
                  0 0 60px rgba(255, 0, 255, 0.3),
                  0 0 90px rgba(0, 255, 255, 0.2)
                `,
                fontFamily: 'system-ui, -apple-system, sans-serif',
                letterSpacing: '0.05em'
              }}
              data-testid="page-title"
            >
              Insurance Regulations Guide
            </h1>
            <p 
              className="text-2xl mb-12 text-cyan-200"
              style={{
                textShadow: '0 0 20px rgba(0, 255, 255, 0.4)'
              }}
            >
              28 U.S. States • 2025 Edition • Enterprise-Grade Reference
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
              <div 
                className="glass p-6 text-center group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: '0 0 30px rgba(0, 255, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                data-testid="stat-states"
              >
                <div 
                  className="text-4xl font-bold text-cyan-300 mb-2 group-hover:text-cyan-200 transition-colors duration-300"
                  style={{ textShadow: '0 0 20px rgba(0, 255, 255, 0.6)' }}
                >
                  28
                </div>
                <div className="text-sm text-gray-300 font-medium">States Covered</div>
              </div>
              <div 
                className="glass p-6 text-center group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: '0 0 30px rgba(255, 0, 255, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                data-testid="stat-statutes"
              >
                <div 
                  className="text-4xl font-bold text-fuchsia-300 mb-2 group-hover:text-fuchsia-200 transition-colors duration-300"
                  style={{ textShadow: '0 0 20px rgba(255, 0, 255, 0.6)' }}
                >
                  500+
                </div>
                <div className="text-sm text-gray-300 font-medium">Statutes Referenced</div>
              </div>
              <div 
                className="glass p-6 text-center group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: '0 0 30px rgba(34, 197, 94, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                data-testid="stat-updated"
              >
                <div 
                  className="text-4xl font-bold text-green-300 mb-2 group-hover:text-green-200 transition-colors duration-300"
                  style={{ textShadow: '0 0 20px rgba(34, 197, 94, 0.6)' }}
                >
                  100%
                </div>
                <div className="text-sm text-gray-300 font-medium">Up-to-Date 2025</div>
              </div>
              <div 
                className="glass p-6 text-center group hover:scale-105 transition-all duration-500"
                style={{
                  background: 'linear-gradient(135deg, rgba(251, 146, 60, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: '0 0 30px rgba(251, 146, 60, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                }}
                data-testid="stat-access"
              >
                <div 
                  className="text-4xl font-bold text-orange-300 mb-2 group-hover:text-orange-200 transition-colors duration-300"
                  style={{ textShadow: '0 0 20px rgba(251, 146, 60, 0.6)' }}
                >
                  24/7
                </div>
                <div className="text-sm text-gray-300 font-medium">Access Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation Tabs */}
        <div 
          className="glass mb-12 p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="flex flex-wrap justify-center gap-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`btn-glass px-8 py-4 font-bold text-lg transition-all duration-500 group ${
                  selectedTab === tab.id
                    ? "scale-105 shadow-lg"
                    : "hover:scale-105"
                }`}
                style={{
                  background: selectedTab === tab.id 
                    ? 'linear-gradient(135deg, rgba(0, 255, 255, 0.2) 0%, rgba(255, 0, 255, 0.2) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                  boxShadow: selectedTab === tab.id 
                    ? '0 0 30px rgba(0, 255, 255, 0.3), 0 0 60px rgba(255, 0, 255, 0.2)'
                    : '0 0 20px rgba(255, 255, 255, 0.1)',
                  textShadow: selectedTab === tab.id 
                    ? '0 0 15px rgba(0, 255, 255, 0.8)'
                    : '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
                data-testid={`tab-${tab.id}`}
              >
                <span className={selectedTab === tab.id ? 'text-cyan-200' : 'text-gray-200 group-hover:text-white'}>
                  {tab.label}
                </span>
                {tab.count > 0 && (
                  <span 
                    className="ml-3 px-3 py-1 text-xs rounded-full font-bold"
                    style={{
                      background: selectedTab === tab.id 
                        ? 'rgba(0, 255, 255, 0.3)'
                        : 'rgba(255, 255, 255, 0.2)',
                      color: selectedTab === tab.id ? '#67e8f9' : '#e5e7eb'
                    }}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filters */}
        <div 
          className="glass p-8 mb-12"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
            boxShadow: '0 0 40px rgba(0, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
          }}
        >
          <div className="space-y-6">
            <div className="relative group">
              <Search 
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-cyan-400 z-10" 
                style={{ filter: 'drop-shadow(0 0 5px rgba(0, 255, 255, 0.6))' }}
              />
              <input
                type="text"
                placeholder="Search states, authorities, directors, or unique features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-14 pr-6 py-4 text-lg text-white placeholder-gray-400 bg-transparent border-2 border-cyan-400/30 rounded-2xl transition-all duration-500 group-hover:border-cyan-400/50 focus:border-cyan-400 focus:outline-none focus:ring-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(0, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                  backdropFilter: 'blur(20px)',
                  boxShadow: `
                    0 0 20px rgba(0, 255, 255, 0.1),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    0 8px 32px rgba(0, 0, 0, 0.2)
                  `,
                  textShadow: '0 0 10px rgba(255, 255, 255, 0.5)'
                }}
                data-testid="search-input"
              />
            </div>
            
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <Filter 
                  className="w-6 h-6 text-fuchsia-400" 
                  style={{ filter: 'drop-shadow(0 0 5px rgba(255, 0, 255, 0.6))' }}
                />
                <span 
                  className="text-lg font-bold text-fuchsia-300"
                  style={{ textShadow: '0 0 10px rgba(255, 0, 255, 0.5)' }}
                >
                  Filter by:
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {filterOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setFilterBy(option.id)}
                    className={`btn-glass px-6 py-3 text-sm font-bold transition-all duration-500 hover:scale-105 ${
                      filterBy === option.id
                        ? "scale-105"
                        : ""
                    }`}
                    style={{
                      background: filterBy === option.id 
                        ? 'linear-gradient(135deg, rgba(255, 0, 255, 0.2) 0%, rgba(0, 255, 255, 0.2) 100%)'
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                      boxShadow: filterBy === option.id 
                        ? '0 0 25px rgba(255, 0, 255, 0.3), 0 0 50px rgba(0, 255, 255, 0.2)'
                        : '0 0 15px rgba(255, 255, 255, 0.1)',
                      textShadow: filterBy === option.id 
                        ? '0 0 10px rgba(255, 0, 255, 0.8)'
                        : '0 0 5px rgba(255, 255, 255, 0.5)',
                      color: filterBy === option.id ? '#f0abfc' : '#e5e7eb'
                    }}
                    data-testid={`filter-${option.id}`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-8">
          <div 
            className="glass p-4 inline-block"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}
          >
            <p 
              className="text-green-300 text-lg font-medium"
              style={{ textShadow: '0 0 10px rgba(34, 197, 94, 0.5)' }}
              data-testid="results-summary"
            >
              Showing <span className="font-bold text-cyan-300">{filteredStates.length}</span> of{" "}
              <span className="font-bold text-cyan-300">{Object.keys(statesData).length}</span> states
              {searchTerm && (
                <span> matching "<span className="font-bold text-fuchsia-300">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
        </div>

        {/* State Cards Grid */}
        {selectedTab === "all" || selectedTab === "search" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" data-testid="state-cards-grid">
            {filteredStates.map(([stateName, stateData]) => (
              <StateCard
                key={stateName}
                stateName={stateName}
                stateData={stateData}
              />
            ))}
          </div>
        ) : selectedTab === "comparison" ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-blue-600 text-white p-4">
              <h2 className="text-xl font-bold">Quick Comparison Table</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">State</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CE Hours</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pre-licensing</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam Vendor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age Requirement</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStates.map(([stateName, stateData]) => (
                    <tr key={stateName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stateName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                          {stateData.ceHours.split(' ')[0]} hrs
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{stateData.preLicensing}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stateData.examVendor}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stateData.ageRequirement}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* Footer */}
        <div className="mt-16 bg-gray-900 text-white rounded-lg p-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-yellow-400">Important Disclaimer</h3>
            <p className="text-gray-300 leading-relaxed">
              This consolidated guide provides educational information about insurance licensing regulations 
              across 28 U.S. states as of 2025. While every effort has been made to ensure accuracy, 
              regulations may change frequently. Always verify current requirements with the respective 
              state insurance departments before making licensing decisions. This guide is not a substitute 
              for professional legal advice or official regulatory guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}