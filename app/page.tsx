'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, FileText, Users, DollarSign, Sparkles, LightbulbIcon, Star, Lock } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Marquee from 'react-fast-marquee';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState, useRef, type MouseEvent as ReactMouseEvent } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from 'next/link';

const formSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  email: z.string().email("Please enter a valid email address"),
  city: z.string().min(1, "City is required"),
  province: z.string().min(1, "Province/Territory is required"),
  businessType: z.enum(["for-profit", "non-profit"]),
  industry: z.string().min(1, "Industry is required"),
  otherIndustry: z.string().optional().refine((val) => {
    // If industry is "other", then otherIndustry is required
    return true;
  }, "Please specify your industry"),
  businessStage: z.string().min(1, "Business stage is required"),
  startDate: z.string().min(1, "Start date is required"),
  gender: z.string().min(1, "Gender is required"),
  ageRange: z.string().min(1, "Age range is required"),
  underrepresentedGroups: z.array(z.string()).optional(),
  otherUnderrepresentedGroup: z.string().optional(),
});

interface FundingOpportunity {
  title: string
  description: string
  url: string
  type: string
  category: string
  notes?: string
  deadline?: string
  max_amount?: string
  funding_provider?: string
}

const fundingOpportunities: FundingOpportunity[] = [
  {
    "title": "Amber Grant for Women",
    "description": "Monthly grant of $10,000 for women entrepreneurs, with each monthly winner eligible for a $25,000 year-end grant. Simple application (with a $15 fee) open to women-owned businesses in any industry.",
    "url": "https://ambergrantsforwomen.com",
    "type": "non-repayable grant",
    "category": "women-focused business funding",
    "deadline": "Monthly (last day of each month)",
    "max_amount": "$10,000 (monthly); $25,000 annual bonus",
    "funding_provider": "Amber Grant (WomensNet)"
  },
  {
    "title": "Zensurance Small Business Grant 2024",
    "description": "Annual small business grant offering a $10,000 grand prize and five $1,000 grants to Canadian small businesses. Open to businesses nationwide (except QC and territories), with 2024 applications from Sept 3 to Nov 8, 2024.",
    "url": "https://www.zensurance.com/blog/15-business-grants-and-loans-for-women-in-canada",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards",
    "deadline": "November 8, 2024 (for 2024 cycle)",
    "max_amount": "$10,000 (grand prize); $1,000 (runner-up grants)",
    "funding_provider": "Zensurance"
  },
  {
    "title": "Visa Canada She's Next Grant Program",
    "description": "Grant program in partnership with IFundWomen that awards ten $10,000 CAD grants to women-owned small businesses in Canada, along with a year of coaching and mentorship. Typically runs annually in the spring.",
    "url": "https://ifundwomen.com/visa-canada",
    "type": "non-repayable grant",
    "category": "women-focused business funding",
    "deadline": "Spring 2024 (last round closed May 2024; future rounds expected)",
    "max_amount": "$10,000 per winner",
    "funding_provider": "Visa Canada & IFundWomen"
  },
  {
    "title": "BMO Celebrating Women Grant Program",
    "description": "Annual program providing 15 grants of $10,000 each to women-owned businesses. Applicants share growth plans addressing specified criteria. The 2024 application window was Apr 30–May 14, 2024, with new rounds expected yearly.",
    "url": "https://bmoforwomen.smapply.org/",
    "type": "non-repayable grant",
    "category": "women-focused business funding",
    "deadline": "May 14, 2024 (2024 round; typically annual)",
    "max_amount": "$10,000 per grant",
    "funding_provider": "BMO (Bank of Montreal)"
  },
  {
    "title": "RBC Canadian Women Entrepreneur Awards",
    "description": "National awards program recognizing women entrepreneurs, with multiple categories and cash grants from $5,000 to $10,000 for winners. Provides recognition, mentorship, and financial support; nominations for 2024 are open now.",
    "url": "https://www.womenofinfluence.ca/rbc-cwea/",
    "type": "non-repayable grant (award)",
    "category": "competitions and awards (women-focused)",
    "deadline": "Varies by year (2024 nominations open; winners announced Nov 2024)",
    "max_amount": "$5,000–$10,000 per award",
    "funding_provider": "RBC & Women of Influence"
  },
  {
    "title": "Canada's Total Mom Pitch",
    "description": "A small business pitch competition for mom entrepreneurs across Canada, offering a $50,000 prize package in funding and business support to the winner. Provides mentorship and exposure; applications typically close in early spring each year.",
    "url": "https://www.totalmompitch.ca/",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards (women-focused)",
    "deadline": "Expected March 2025 (annual application cycle)",
    "max_amount": "$50,000 prize package",
    "funding_provider": "Total Mom Inc. (with sponsors like QuickBooks)"
  },
  {
    "title": "The Odlum Brown Forum Pitch",
    "description": "Formerly Pitch for the Purse, this national competition for women entrepreneurs awards three finalists with prize packages valued around $30,000 each in cash and support. The 2024 finale awarded approximately $46,500 per winner; annual program with fall/winter application period.",
    "url": "https://www.theforumpitch.ca/",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards (women-focused)",
    "deadline": "Fall 2024 (for 2024–25 cohort; varies annually)",
    "max_amount": "~$30,000 value per finalist",
    "funding_provider": "The Forum (formerly Forum for Women Entrepreneurs)"
  },
  {
    "title": "TELUS #StandWithOwners Small Business Contest",
    "description": "National contest supporting small businesses with major funding and technology prizes. In 2024, TELUS awarded six grand prizes of $200,000 each and fourteen $20,000 prizes (cash and services). Applications opened June 4 and closed Sep 4, 2024; expected to return in 2025.",
    "url": "https://www.telus.com/en/business/small/campaigns/stand-with-owners",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards",
    "deadline": "September 4, 2024 (2024 contest; annual timeline)",
    "max_amount": "$200,000 (grand prize); $20,000 (other winners)",
    "funding_provider": "TELUS Business"
  },
  {
    "title": "FedEx Small Business Grant Contest (Canada)",
    "description": "Annual contest awarding grants to Canadian small businesses. Typically 10 winners: one grand prize $30,000, one $15,000, and eight $5,000 grants, plus marketing consultation prizes. The 2024 contest closed in May; future editions are anticipated.",
    "url": "https://www.fedex.com/en-ca/small-business/grant-contest.html",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards",
    "deadline": "May 2024 (2024 cycle; typically annual spring)",
    "max_amount": "$30,000 (grand prize); smaller grants for other winners",
    "funding_provider": "FedEx Canada"
  },
  {
    "title": "Cartier Women's Initiative",
    "description": "Global entrepreneurship program for women-led impact businesses. Offers coaching and grants to regional laureates (e.g., top North America awardee receives US$100,000). The next call for applications runs Apr 18 – Jun 24, 2025.",
    "url": "https://www.cartierwomensinitiative.com/",
    "type": "non-repayable grant (competition)",
    "category": "competitions and awards (women-focused, sustainability)",
    "deadline": "June 24, 2025 (2026 edition application deadline)",
    "max_amount": "US$100,000 (top laureate); US$30,000–$60,000 for other laureates",
    "funding_provider": "Cartier Women's Initiative"
  },
  {
    "title": "WeBC Business Loans (Women's Enterprise Centre of BC)",
    "description": "Provides business loans of up to $150,000 for women entrepreneurs in British Columbia to start, scale, or purchase a business. Offers flexible repayment terms and mentoring. Applications are accepted on an ongoing basis.",
    "url": "https://we-bc.ca/services/loans/",
    "type": "loans and financing",
    "category": "women-focused business funding",
    "deadline": "Ongoing",
    "max_amount": "$150,000",
    "funding_provider": "WeBC (Women's Enterprise Centre of BC)"
  },
  {
    "title": "Women Entrepreneurship Loan Fund (WELF)",
    "description": "A federal micro-loan program offering up to $50,000 to women-owned businesses across Canada. Delivered through select non-profit organizations (e.g., Women's Enterprise Organizations of Canada, NACCA, Coralus). Applications are via participating lenders, open continuously.",
    "url": "https://ised-isde.canada.ca/site/fednor/en/women-entrepreneurship-loan-fund",
    "type": "loans and financing",
    "category": "women-focused business funding",
    "deadline": "Ongoing",
    "max_amount": "$50,000",
    "funding_provider": "Government of Canada (Innovation, Science and Economic Development)"
  },
  {
    "title": "DELIA – Women's Micro Loan Program",
    "description": "A national microloan program providing affordable loans of $15,000 to women-owned businesses across Canada. Supported by FedDev Ontario and delivered by Northumberland CFDC, it is open to female entrepreneurs 19+, Canadian citizens or PR. Continuous intake via an online platform.",
    "url": "https://nventure.ca/DELIA",
    "type": "loans and financing",
    "category": "women-focused business funding",
    "deadline": "Ongoing",
    "max_amount": "$15,000",
    "funding_provider": "Northumberland CFDC (FedDev Ontario funded)"
  },
  {
    "title": "Coralus (SheEO) 0% Interest Venture Loans",
    "description": "A community-funded program offering 0% interest, five-year loans to women- and non-binary-owned ventures. Selected businesses (Ventures) receive roughly $100k in no-interest financing plus coaching in a supportive network. Annual call for applications (usually closing in fall).",
    "url": "https://coralus.world/venture-application",
    "type": "loans and financing (0% interest)",
    "category": "women-focused business funding",
    "deadline": "Annual (e.g., Fall 2024 for 2025 cohort)",
    "max_amount": "~$100,000 (loan, 0% interest)",
    "funding_provider": "Coralus (formerly SheEO)"
  },
  {
    "title": "Futurpreneur Canada Startup Loan & Mentorship",
    "description": "Financing program for young entrepreneurs (aged 18–39) providing up to $60,000 in startup loans, coupled with a 2-year mentorship. Offers initial loan (up to $20K) plus potential BDC match up to $40K. Applications accepted year-round; age criterion applies.",
    "url": "https://www.futurpreneur.ca/en/launching-your-business/start-up-program/",
    "type": "loans and financing",
    "category": "small business support programs",
    "deadline": "Ongoing",
    "max_amount": "$60,000 (loan financing)",
    "funding_provider": "Futurpreneur Canada (with BDC)"
  },
  {
    "title": "Canada Digital Adoption Program (Grow Your Business Online)",
    "description": "Federal micro-grant up to $2,400 to help small businesses adopt e-commerce and digital technologies. Supports costs like website improvements, digital marketing tools, etc. Available to eligible small businesses (for-profit, <$500k revenue) on a rolling basis.",
    "url": "https://ised-isde.canada.ca/site/canada-digital-adoption-program/en",
    "type": "non-repayable grant",
    "category": "small business support programs (digital adoption)",
    "deadline": "Ongoing (until funds expended)",
    "max_amount": "$2,400",
    "funding_provider": "Innovation, Science and Economic Development Canada"
  },
  {
    "title": "Canada Summer Jobs Wage Subsidy 2025",
    "description": "Wage subsidy program to encourage hiring youth (15–30) for summer jobs. Private sector employers can receive 50% of minimum wage, and non-profits 100% for each summer employee. Jobs can run Apr 21–Aug 30, 2025; application deadline for 2025 is Dec 19, 2024.",
    "url": "https://www.canada.ca/en/employment-social-development/services/funding/youth-summer-job.html",
    "type": "hiring incentive (wage subsidy)",
    "category": "hiring and tax incentives",
    "deadline": "December 19, 2024 (for Summer 2025 positions)",
    "max_amount": "50% wage subsidy (100% for nonprofits)",
    "funding_provider": "Government of Canada (ESDC)"
  },
  {
    "title": "Student Work Placement Program (SWPP)",
    "description": "Federal program that subsidizes wages for post-secondary student interns. Employers can be reimbursed 50% of wages up to $5,000 per placement, or 70% up to $7,000 for hiring first-year students or those from under-represented groups. Applications are handled by partner organizations year-round.",
    "url": "https://www.canada.ca/en/employment-social-development/programs/work-integrated-learning.html",
    "type": "hiring incentive (wage subsidy)",
    "category": "hiring and tax incentives",
    "deadline": "Ongoing (continuous intake by delivery partners each term)",
    "max_amount": "$5,000–$7,000 per placement",
    "funding_provider": "Government of Canada (ESDC, delivered via partners)"
  },
  {
    "title": "WorkBC Wage Subsidy Program",
    "description": "BC provincial wage subsidy to help employers hire and train new employees. Covers a portion of wages for up to 24 weeks, starting at ~50% and tapering to 15%. Employers must register with WorkBC; subsidy amount/duration depends on training needs. Open year-round.",
    "url": "https://www.workbc.ca/Employment-Services/WorkBC-Centres/Wage-Subsidy.aspx",
    "type": "hiring incentive (wage subsidy)",
    "category": "hiring and tax incentives",
    "deadline": "Ongoing",
    "max_amount": "≈50% of wages (initial), decreasing to 15% over 24 weeks",
    "funding_provider": "WorkBC (Province of BC)"
  },
  {
    "title": "B.C. Employer Training Grant (ETG)",
    "description": "Cost-sharing program that funds skills training for employees. Employers can receive up to 80% of training costs, to a maximum of $10,000 per worker and $300,000 per year. Several funding streams (e.g., workforce training, technical skills). Applications open year-round via online portal.",
    "url": "https://www.workbc.ca/Employer-Resources/BC-Employer-Training-Grant.aspx",
    "type": "non-repayable grant",
    "category": "hiring and tax incentives (training support)",
    "deadline": "Ongoing (applications accepted anytime)",
    "max_amount": "$10,000 per trainee (up to $300,000 per employer annually)",
    "funding_provider": "Province of BC (WorkBC/Ministry of Skills Training)"
  },
  {
    "title": "Canada Small Business Financing Program (CSBFP)",
    "description": "Government-backed loan program that helps small businesses secure up to $1,000,000 in financing for expansion and improvements. Loans (term loans and lines of credit) are issued by participating financial institutions under CSBFP guarantee. Available year-round via banks/credit unions.",
    "url": "https://ised-isde.canada.ca/site/canada-small-business-financing-program/en",
    "type": "loans and financing (loan guarantee)",
    "category": "small business support programs",
    "deadline": "Ongoing",
    "max_amount": "$1,000,000 (term loan); $150,000 (lines of credit)",
    "funding_provider": "Innovation, Science and Economic Development Canada (through banks)"
  },
  {
    "title": "Tourism Richmond Cooperative Marketing Investment Program 2025",
    "description": "Matching funding (50/50) for collaborative marketing or experience development projects that promote Richmond as a destination. Richmond tourism businesses partnering together can apply. No fixed deadline noted for 2025 – projects are reviewed on an ongoing annual cycle.",
    "url": "https://www.visitrichmondbc.com/itineraries/cooperative-marketing-investment-program/",
    "type": "non-repayable grant (matching)",
    "category": "local business support (tourism marketing)",
    "deadline": "Ongoing/annual (info sessions and intakes periodically)",
    "max_amount": "50% of project costs (up to project-specific limits)",
    "funding_provider": "Tourism Richmond"
  },
  {
    "title": "Travel Trade & Media Marketplace Grant 2025 (Richmond)",
    "description": "Grants up to $1,000 to help Richmond tourism businesses attend key travel trade or media events. Covers registration fees for events like Rendez-vous Canada, CITAP, etc. Limited number available first-come, first-served. Application via Tourism Richmond; open until funds are allocated.",
    "url": "https://www.visitrichmondbc.com/itineraries/travel-trade-and-media-marketplace-grant-2025/",
    "type": "non-repayable grant",
    "category": "local business support (tourism)",
    "deadline": "Ongoing (for 2025 events, until budget is used)",
    "max_amount": "$1,000 per business",
    "funding_provider": "Tourism Richmond"
  },
  {
    "title": "CleanBC Go Electric EV Charger Rebate (Workplace)",
    "description": "Rebates to install electric vehicle charging stations at workplaces. Businesses can get 50% of costs, up to $2,000 per Level 2 charger (max $14,000 per site). Pre-approval from BC Hydro required; applications open until funds are fully subscribed.",
    "url": "https://goelectricbc.gov.bc.ca/for-businesses/#workplace-chargers",
    "type": "rebate (non-repayable)",
    "category": "green and sustainability initiatives",
    "deadline": "Ongoing (until funding is exhausted)",
    "max_amount": "$2,000 per charger (50% of cost; up to $14,000 per site)",
    "funding_provider": "Province of BC (CleanBC, via BC Hydro/FortisBC)"
  },
  {
    "title": "CleanBC Plastics Action Fund",
    "description": "Grant funding for projects that reduce plastic waste through recycling, reuse or remanufacturing innovations. Covers up to 66% of project costs (projects typically $250k–$1.2M). Eligible BC businesses, non-profits, Indigenous organizations. **Deadline**: December 2, 2024 (or until funds are allocated).",
    "url": "https://www.alacritycanada.com/cleanbc-plastics-action-fund/",
    "type": "non-repayable grant",
    "category": "green and sustainability initiatives",
    "deadline": "December 2, 2024 (current intake)",
    "max_amount": "66% of project costs (no explicit dollar cap given; typical project $250k–$1.2M)",
    "funding_provider": "CleanBC (Province of BC, administered by Alacrity Canada)"
  },
  {
    "title": "B.C. Electricity Affordability Credit (Commercial)",
    "description": "A one-time bill credit in 2024 to reduce electricity costs for businesses as part of BC's climate action plan. Commercial customers receive a credit equal to ~4.6% of annual consumption, averaging $400 in savings for a small business. Automatically applied on BC Hydro/FortisBC bills starting April 2024.",
    "url": "https://news.gov.bc.ca/releases/2024EMLI0013-000405",
    "type": "tax incentive (utility bill credit)",
    "category": "green and sustainability initiatives",
    "deadline": "N/A (automatic in 2024)",
    "max_amount": "~4.6% of annual electricity costs (approx. $400 for a small business)",
    "funding_provider": "Province of BC"
  },
  {
    "title": "Enabling Accessibility Fund – Small Projects",
    "description": "Federal grant program to improve accessibility in workplaces and community spaces. Provides up to $100,000 per project for renovations such as ramps, elevators, accessible washrooms. Current call prioritizes certain groups (e.g., Indigenous-led projects). Calls for proposals are periodic; the 2025 CFP was recently announced.",
    "url": "https://www.canada.ca/en/employment-social-development/programs/enabling-accessibility-fund.html",
    "type": "non-repayable grant",
    "category": "small business support (accessibility)",
    "deadline": "2025 call open (deadline to be announced; typically annual)",
    "max_amount": "$100,000",
    "funding_provider": "Employment and Social Development Canada"
  },
  {
    "title": "Apprenticeship Job Creation Tax Credit (AJCTC)",
    "description": "A federal tax credit for employers hiring apprentices in Red Seal trades. The credit equals 10% of eligible apprentice wages, up to $2,000 per apprentice per year. Employers claim it on their tax return for apprentices in first two years of their program.",
    "url": "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/credits/apprenticeship-job-creation.html",
    "type": "tax incentive (hiring credit)",
    "category": "hiring and tax incentives",
    "deadline": "N/A (claim via tax filing annually)",
    "max_amount": "$2,000 per apprentice per year",
    "funding_provider": "Government of Canada (CRA)"
  },
  {
    "title": "British Columbia Training Tax Credit (Employers)",
    "description": "Refundable provincial tax credits for employing apprentices in eligible trades programs. For non-Red Seal programs, employers get 20% of wages paid in first 24 months (Basic credit). Completion credits of 15% of wages (up to $2,500 for level 3; $3,000 for level 4) reward apprentices completing training. Enhanced credits available if the apprentice is Indigenous or has a disability.",
    "url": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/corporate/credits/training-tax-credit",
    "type": "tax incentive (hiring credit)",
    "category": "hiring and tax incentives",
    "deadline": "N/A (claim via tax return)",
    "max_amount": "Basic: up to $6,000; Completion: up to $2,500–$3,000 (with higher amounts for eligible groups)",
    "funding_provider": "Province of British Columbia"
  },
  {
    "title": "Scotiabank Women Initiative",
    "description": "A comprehensive program (not a direct grant) offering women entrepreneurs access to capital, tailored financing solutions, mentorship, and advisory services. Helps women-led businesses secure financing and offers networking and educational resources. Open to women and non-binary business owners in all industries.",
    "url": "https://www.scotiabank.com/women-initiative",
    "type": "loans and financing (with mentorship)",
    "category": "women-focused business support",
    "deadline": "Ongoing",
    "max_amount": "Varies (financing up to ~$150,000 or more)",
    "funding_provider": "Scotiabank"
  }
];
 
interface DialogModalContentProps {
  setParentOpen: (open: boolean) => void;
}

function DialogModalContent({ setParentOpen }: DialogModalContentProps) {
  const [showGetReportModal, setShowGetReportModal] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>("")
  const categoryRefs = useRef<Record<string, HTMLDivElement>>({})

  const groupedOpportunities = fundingOpportunities.reduce(
    (acc, opportunity) => {
      if (!acc[opportunity.category]) {
        acc[opportunity.category] = []
      }
      acc[opportunity.category].push(opportunity)
      return acc
    },
    {} as Record<string, FundingOpportunity[]>,
  )

  const scrollToCategory = (category: string) => {
    setActiveCategory(category)
    const element = categoryRefs.current[category]
    if (element) {
      const topOffset = element.offsetTop - 120
      const scrollContainer = element.closest('.overflow-y-auto')
      if (scrollContainer) {
        scrollContainer.scrollTo({
          top: topOffset,
          behavior: "smooth"
        })
      }
    }
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="w-full bg-gray-50 min-h-full">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <h1 className="text-4xl font-bold mb-2 text-gray-900">Funding Opportunities (Sample)</h1>
          <p className="text-xl text-gray-600 mb-8">
            For Tao Day Spa (Steveston, BC) • {fundingOpportunities.length} opportunities found
          </p>

          <div className="sticky top-0 bg-gray-50 py-4 z-10">
            <Select
              value={activeCategory}
              onValueChange={(value) => scrollToCategory(value)}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Jump to category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(groupedOpportunities).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({groupedOpportunities[category].length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-12 pl-4">
            {Object.entries(groupedOpportunities).map(([category, opportunities]) => (
              <section 
                key={category} 
                ref={(el) => {
                  if (el) categoryRefs.current[category] = el as HTMLDivElement
                }}
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b border-gray-200 pb-2">
                  {category.charAt(0).toUpperCase() + category.slice(1)} ({opportunities.length})
                </h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {opportunities.map((opportunity, index) => (
                    <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
                      <CardHeader className="bg-gray-50 border-b">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <CardTitle className={`text-lg font-semibold text-gray-900 ${index > 0 ? "blur-sm select-none" : ""}`}>
                              {opportunity.title}
                            </CardTitle>
                            {opportunity.funding_provider && (
                              <p className={`text-sm text-gray-500 mt-1 ${index > 0 ? "blur-sm select-none" : ""}`}>
                                by {opportunity.funding_provider}
                              </p>
                            )}
                          </div>
                          {index > 0 && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="shrink-0 text-gray-400 hover:text-primary hover:bg-primary/10"
                                    onClick={() => setShowGetReportModal(true)}
                                  >
                                    <Lock className="w-4 h-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="left" className="max-w-[200px]">
                                  <p>Get your personalized report to unlock all funding opportunities</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className={`text-sm text-gray-600 mb-6 ${index > 0 ? "blur-sm select-none" : ""}`}>
                          {opportunity.description}
                        </p>
                        <div className="grid gap-4">
                          <div className="space-y-1">
                            <p className="text-xs font-medium text-gray-500">Type</p>
                            <div className="flex flex-wrap gap-2">
                              <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                {opportunity.type}
                              </span>
                            </div>
                          </div>
                          {opportunity.max_amount && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-500">Maximum Amount</p>
                              <p className={`text-sm font-semibold text-emerald-600 ${index > 0 ? "blur-sm select-none" : ""}`}>
                                {opportunity.max_amount}
                              </p>
                            </div>
                          )}
                          {opportunity.deadline && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-500">Deadline</p>
                              <p className={`text-sm text-gray-900 ${index > 0 ? "blur-sm select-none" : ""}`}>
                                {opportunity.deadline}
                              </p>
                            </div>
                          )}
                          {opportunity.notes && (
                            <div className="space-y-1">
                              <p className="text-xs font-medium text-gray-500">Additional Notes</p>
                              <p className={`text-sm text-gray-600 ${index > 0 ? "blur-sm select-none" : ""}`}>
                                {opportunity.notes}
                              </p>
                            </div>
                          )}
                        </div>
                        {index === 0 ? (
                          <div className="mt-6 pt-6 border-t border-gray-100 text-sm text-gray-500 italic">
                            Full details available in your personalized report
                          </div>
                        ) : (
                          <div className="mt-6 pt-6 border-t border-gray-100">
                            <Button 
                              className="w-full" 
                              variant="outline"
                              onClick={() => setShowGetReportModal(true)}
                            >
                              Unlock Full Details
                              <Lock className="w-4 h-4 ml-2" />
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      {/* Get Report Modal */}
      <Dialog open={showGetReportModal} onOpenChange={setShowGetReportModal}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Get Your Personalized Grant Report</DialogTitle>
            <DialogDescription>
              Unlock all funding opportunities and get a customized report for your business within 48 hours.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                <span>Access to all funding opportunities matching your business</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                <span>Detailed eligibility criteria and application requirements</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                <span>Direct application links and deadlines</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CheckCircle className="text-primary w-5 h-5 shrink-0" />
                <span>Expert recommendations and priority opportunities</span>
              </div>
            </div>

            <div className="flex justify-between items-center p-4 bg-primary/5 rounded-lg mb-4">
              <div>
                <p className="font-semibold">One-time Report Fee</p>
                <p className="text-sm text-muted-foreground">No recurring charges</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">$100 <span className="text-sm font-normal text-muted-foreground">CAD</span></p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-lg mb-8 text-sm text-muted-foreground">
              <img src="/images/stripe.svg" alt="Stripe" className="h-5" />
              <span>Your purchase is protected by Stripe secure payment</span>
            </div>

            <Link href="/business-details" className="w-full">
              <Button 
                className="w-full" 
                size="lg"
                onClick={() => setShowGetReportModal(false)}
              >
                Continue to Business Details
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function Home() {
  const [open, setOpen] = useState(false);
  const [showOtherField, setShowOtherField] = useState(false);
  const [showOtherIndustry, setShowOtherIndustry] = useState(false);
  const [showSampleReport, setShowSampleReport] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessType: "for-profit",
      underrepresentedGroups: [],
      otherUnderrepresentedGroup: "",
      otherIndustry: "",
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    console.log(data);
    // Here you would typically send the data to your backend
    setOpen(false);
  };

  const testimonials = [
    {
      name: 'Sarah Chen',
      company: 'TechVision Inc.',
      content: 'The grant report we received helped us identify over $250,000 in potential funding. Absolutely worth the investment.',
      role: 'Founder & CEO',
    },
    {
      name: 'Michael Thompson',
      company: 'EcoSolutions Canada',
      content: 'Grant Pathway streamlined our search for sustainability grants. Their report was thorough and actionable.',
      role: 'Operations Director',
    },
    {
      name: 'Priya Patel',
      company: 'Innovation Labs',
      content: 'The level of detail in our customized report was impressive. We successfully secured two grants from their recommendations.',
      role: 'Managing Director',
    },
  ];

  const faqs = [
    {
      question: 'How detailed is the grant report?',
      answer: 'Our comprehensive report includes detailed grant descriptions, eligibility criteria, application deadlines, funding amounts, and direct links to apply. We analyze over 500 funding sources across federal, provincial, and private sectors.',
    },
    {
      question: 'What information do you need from my business?',
      answer: "We require basic information about your business including industry, location, size, revenue, and owner demographics. This helps us identify grants you're most likely to qualify for.",
    },
    {
      question: 'Is my information kept confidential?',
      answer: 'Absolutely. We have strict privacy policies in place and never share your business information with third parties without explicit consent.',
    },
    {
      question: 'What if I need help with the grant application?',
      answer: 'We offer optional grant writing and application support services through our network of experienced professionals for an additional fee.',
    },
  ];

  const businessTypes = [
    {
      image: "/images/businesses/cafe.jpg",
      alt: "Cafe owner smiling at counter",
      label: "Local Cafes"
    },
    {
      image: "/images/businesses/startup.jpg",
      alt: "Tech startup founder",
      label: "Tech Startups"
    },
    {
      image: "/images/businesses/retail.jpg",
      alt: "Retail store owner",
      label: "Retail Stores"
    },
    {
      image: "/images/businesses/manufacturing.jpg",
      alt: "Manufacturing business owner",
      label: "Manufacturing"
    },
    {
      image: "/images/businesses/spas.jpg",
      alt: "Spa owner",
      label: "Spas & Wellness"
    },
    {
      image: "/images/businesses/restaurant.jpg",
      alt: "Restaurant owner",
      label: "Restaurants"
    },
    {
      image: "/images/businesses/fitness.jpg",
      alt: "Fitness studio owner",
      label: "Fitness Studios"
    },
    {
      image: "/images/businesses/fashion.jpg",
      alt: "Boutique owner",
      label: "Fashion Boutiques"
    },
    {
      image: "/images/businesses/bakery.jpg",
      alt: "Bakery owner",
      label: "Bakeries"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <a href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Grant Pathway" className="h-8" />
            </a>
          </div>
          <nav className="flex items-center gap-8">
            <a 
              href="#testimonials" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Testimonials
            </a>
            <a 
              href="#pricing" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <Link href="/business-details">
              <Button variant="outline">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Add padding to account for fixed header */}
      <div className="pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-primary/10 to-background py-20 px-4">
          <div className="absolute inset-0 bg-grid-primary/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-transparent" />
          
          <div className="relative max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 mb-8">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Trusted by 500+ Canadian Businesses</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                <div className="inline-block mr-3">
                  <span className="relative">
                    Unlock
                    <div className="absolute -bottom-2 left-0 right-0 h-3 bg-[#57ad0b] -skew-x-6 transform" />
                  </span>
                </div>
                <span>
                  Your Business's Grant Potential
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
                Get a personalized report of all grants your Canadian business qualifies for, delivered within 48 hours.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
                <Link href="/business-details">
                  <Button size="lg" className="text-lg px-8 h-14 rounded-full">
                    Get Your Grant Report <ArrowRight className="ml-2" />
                  </Button>
                </Link>
                <p className="flex items-center gap-2 text-muted-foreground">
                  <LightbulbIcon className="w-5 h-5 text-primary" />
                  <span>One-time fee of $100 CAD</span>
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto text-center">
                {[
                  { label: 'Success Rate', value: '87%' },
                  { label: 'Average Grant Size', value: '$75K' },
                  { label: 'Grants Found', value: '500+' },
                  { label: 'Happy Clients', value: '1000+' },
                ].map((stat, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-3xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Business Owners Gallery */}
        <section className="py-16 bg-background overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 mb-8">
            <h2 className="text-2xl md:text-3xl text-center font-medium text-muted-foreground">
              Join Thousands of Canadian Businesses We've Helped
            </h2>
          </div>
          <Marquee
            gradient={false}
            speed={40}
            pauseOnHover={false}
            className="py-4"
          >
            <div className="flex gap-4">
              {businessTypes.map((business, index) => (
                <div key={index} className="relative aspect-[3/4] w-60 flex-none overflow-hidden rounded-2xl">
                  <img 
                    src={business.image}
                    alt={business.alt}
                    className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <p className="absolute bottom-4 left-4 text-white font-medium">{business.label}</p>
                </div>
              ))}
              <div className=" flex-none" aria-hidden="true" />
            </div>
          </Marquee>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-6 text-center">
                <FileText className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">1. Share Details</h3>
                <p className="text-muted-foreground">
                  Provide information about your business through our secure form
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">2. Expert Analysis</h3>
                <p className="text-muted-foreground">
                  Our team analyzes your eligibility across hundreds of grants
                </p>
              </Card>
              <Card className="p-6 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">3. Get Your Report</h3>
                <p className="text-muted-foreground">
                  Receive your personalized report within 48 hours
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* Sample Report */}
        <section className="py-20 px-4 bg-[#57ad0b]/10">
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              <div className="absolute inset-0 bg-grid-black/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">What You'll Receive</h2>
                <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
                  A comprehensive grant report tailored to your business needs
                </p>
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8">
                    <ul className="space-y-4">
                      {[
                        'Comprehensive list of matching grants',
                        'Detailed eligibility criteria',
                        'Application deadlines and requirements',
                        'Funding amounts and terms',
                        'Direct application links',
                        'Priority recommendations',
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-3">
                          <div className="bg-[#57ad0b] rounded-full p-1">
                            <CheckCircle className="text-white w-4 h-4 shrink-0" />
                          </div>
                          <span className="font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-white rounded-2xl shadow-xl p-6 rotate-1 hover:rotate-0 transition-transform duration-300">
                    <img
                      src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                      alt="Sample Report"
                      className="rounded-lg w-full shadow-lg"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* View Sample Report */}
        <section className="py-20 px-4 bg-[#57ad0b]/5">
          <div className="max-w-3xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-grid-black/5 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">See a Sample Report</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  View the actual grant report we prepared for Tao Day Spa in Steveston, British Columbia
                </p>
                
                <Card className="p-8 mb-8 bg-white/50 backdrop-blur-sm border-2 border-[#57ad0b]/20">
                  <div className="flex flex-col md:flex-row gap-6 items-center text-left">
                    <div className="w-24 h-24 rounded-full overflow-hidden bg-[#57ad0b]/10 flex-none ring-4 ring-[#57ad0b]/20">
                      <img 
                        src="/images/businesses/spas.jpg" 
                        alt="Winnie from Tao Day Spa" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <blockquote className="text-lg mb-4 italic">
                        "The sample report convinced me to try Grant Pathway. We secured two grants worth $175,000 using their recommendations. The report paid for itself many times over."
                      </blockquote>
                      <div>
                        <p className="font-semibold">Winnie Cheung-Pozo</p>
                        <p className="text-sm text-muted-foreground">Owner, Tao Day Spa</p>
                      </div>
                    </div>
                  </div>
                </Card>

                <Dialog open={showSampleReport} onOpenChange={setShowSampleReport}>
                  <DialogTrigger asChild>
                    <Button 
                      size="lg" 
                      className="gap-2 bg-[#57ad0b] hover:bg-[#57ad0b]/90 text-white"
                    >
                      <FileText className="w-4 h-4" />
                      View Sample Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl h-[95vh] p-0 bg-gray-50">
                    <DialogModalContent setParentOpen={setOpen} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 px-4 bg-background">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Success Stories</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-6">
                  <p className="mb-4 text-muted-foreground">{testimonial.content}</p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    <p className="text-sm text-primary">{testimonial.company}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-20 px-4 bg-primary/5">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Need More Support?</h2>
            <Card className="p-8 max-w-2xl mx-auto">
              <DollarSign className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-2xl font-semibold mb-4">Grant Application Support</h3>
              <p className="text-muted-foreground mb-6">
                Get expert help with your grant applications from our network of experienced professionals
              </p>
              <Button variant="outline">Learn More</Button>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-background">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* New Pricing Section */}
        <section id="pricing" className="py-20 px-4 bg-primary/5">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
              Get a comprehensive grant report customized for your business
            </p>
            
            <div className="max-w-lg mx-auto">
              <Card className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold mb-2">Grant Report Package</h3>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-4xl font-bold">$100</span>
                    <span className="text-muted-foreground">CAD</span>
                  </div>
                  <p className="text-muted-foreground">One-time payment, no recurring fees</p>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    'Comprehensive analysis of 500+ funding sources',
                    'Customized grant recommendations',
                    'Detailed eligibility criteria',
                    'Application deadlines and requirements',
                    'Direct application links',
                    'Delivered within 48 hours',
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <Link href="/business-details">
                  <Button className="w-full" size="lg">
                    Get Your Report
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-primary text-primary-foreground py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">Grant Pathway</h3>
                <p className="text-primary-foreground/80">
                  Helping Canadian businesses access the funding they deserve
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Contact</h4>
                <p className="text-primary-foreground/80">contact@grantpathway.ca</p>
                <p className="text-primary-foreground/80">1-800-GRANTS</p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Follow Us</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                    LinkedIn
                  </a>
                  <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                    Twitter
                  </a>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Legal</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                    Privacy Policy
                  </a>
                  <a href="#" className="block text-primary-foreground/80 hover:text-primary-foreground">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
              <p>&copy; 2024 Grant Pathway. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}