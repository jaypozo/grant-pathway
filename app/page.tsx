'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, FileText, Users, DollarSign, Sparkles, LightbulbIcon, Star } from 'lucide-react';
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
}

const fundingOpportunities: FundingOpportunity[] = [
  {
    title: "Canada Small Business Financing Program (CSBFP)",
    description: "A federal loan-guarantee program that helps small businesses get term loans and lines of credit from banks. It offers up to $1 million in term loans (with sub-limits of $500,000 for equipment/leaseholds and $150,000 for working capital). The Government of Canada guarantees 85% of the loan, making it easier for businesses like Tao Day Spa to finance expansions, equipment purchases, or leasehold improvements.",
    url: "https://ised-isde.canada.ca/site/canada-small-business-financing-program/en/canada-small-business-financing-program",
    type: "loans and financing (government-guaranteed term loan)",
    category: "small business support"
  },
  {
    title: "BDC Inclusive Entrepreneurship Loan",
    description: 'Offered by the Business Development Bank of Canada (BDC), this program provides up to $350,000 in financing for businesses at least 51% owned and led by underrepresented entrepreneurs (including women, Indigenous, and Black owners). It\'s a repayable loan designed to help grow or scale the business (e.g., launching growth projects, purchasing equipment, or investing in technology). Tao Day Spa\'s woman-owned status makes it eligible under the "women entrepreneurs" stream.',
    url: "https://www.bdc.ca/en/about/what-we-do/diversity-equity-inclusion/women-entrepreneurship",
    type: "loans and financing",
    category: "women-focused"
  },
  {
    "title": "BDC Small Business Loan (Online)",
    "description": "A quick-access loan from BDC for small businesses, available through an online application. Entrepreneurs can obtain up to $100,000 in financing to grow their business with a 5-year term. It's a flexible, unsecured loan meant to supplement cash flow, invest in online sales, or cover operating expenses. Tao Day Spa can use this for renovations, inventory, or marketing, with no payments on principal for the first 6 months (interest-only in that period).",
    "url": "https://www.bdc.ca/en/financing/business-loans/small-business-loan",
    "type": "loans and financing",
    "category": "small business support"
  },
  {
    "title": "WeBC Business Loans for Women Entrepreneurs",
    "description": "WeBC (formerly Women's Enterprise Centre of BC) offers business loans of up to $150,000 to women-owned businesses in British Columbia. These loans can support start-up, expansion, or the purchase of a business, with flexible repayment terms up to 5 years. In addition to financing, WeBC provides mentorship and business advisory services tailored to women entrepreneurs.",
    "url": "https://we-bc.ca/financing/loan-programs/",
    "type": "loans and financing",
    "category": "women-focused"
  },
  {
    "title": "Women Entrepreneurship Loan Fund",
    "description": "A federal micro-loan program offering up to $50,000 for women entrepreneurs to start or grow their businesses. Delivered through select non-profit organizations (e.g. WeBC, Coralus, etc.), it aims to address financing gaps for women-led companies. Tao Day Spa, as a woman-owned business, could apply through the designated partner in BC to access affordable capital for expansion or new initiatives.",
    "url": "https://ised-isde.canada.ca/site/women-entrepreneurship-strategy/en/women-entrepreneurship-loan-fund",
    "type": "loans and financing",
    "category": "women-focused"
  },
  {
    "title": "DELIA Women Entrepreneurship Microloan",
    "description": "A national loan program (funded by FedDev Ontario) offering affordable microloans of up to $15,000 to women-owned, for-profit businesses across Canada. Applicants must be women (51%+ ownership), Canadian citizens or PRs, and the funds can be used for various business needs. DELIA loans are aimed at closing the financing gap for women entrepreneurs and could help Tao Day Spa invest in new organic product lines or facility upgrades.",
    "url": "https://ncfdc.ca/delia/",
    "type": "loans and financing",
    "category": "women-focused"
  },
  {
    "title": "Scotiabank Women Initiative",
    "description": "An initiative by Scotiabank that, while not a direct grant, provides women-identifying and non-binary entrepreneurs with access to capital, specialized financing solutions, mentorship, and advisory services. This program is designed to help women-led businesses grow and succeed by offering networking opportunities and tailored financial support. Tao Day Spa can leverage this for mentorship and potentially favorable financing terms through Scotiabank's program.",
    "url": "https://www.scotiabank.com/women-initiative/",
    "type": "loans and financing (plus mentorship)",
    "category": "women-focused"
  },
  {
    "title": "RBC + Women of Influence Entrepreneur Awards",
    "description": "A grant program offered jointly by RBC and Women of Influence+ that provides financial awards to women entrepreneurs. Winners receive grants in the range of $5,000 to $10,000 along with national recognition. The program celebrates the achievements of women business owners and offers funding to help them advance their companies. As a female entrepreneur, the owner of Tao Day Spa could apply or be nominated to potentially win funding and gain exposure.",
    "url": "https://www.womenofinfluence.ca/rbc-grant-program/",
    "type": "non-repayable (grant/award)",
    "category": "women-focused"
  },
  {
    "title": "BMO Celebrating Women Grant Program",
    "description": "An annual grant program by BMO that awards multiple cash grants to women-owned businesses in Canada. In 2024, BMO provided ten grants of $10,000 each (totaling $100,000) to selected female entrepreneurs across the country. The grants target businesses launching new products or services, expanding to new markets, or creating jobs. Tao Day Spa could apply for the next round to potentially secure $10k in non-repayable funding to fuel its growth.",
    "url": "https://bmoforwomen.com/celebrating-women-grant-program",
    "type": "non-repayable (grant)",
    "category": "women-focused"
  },
  {
    "title": "Amber Grant for Women",
    "description": "A monthly grant competition open to women entrepreneurs in Canada and the U.S., run by WomensNet. Each month, one winner receives a $10,000 USD grant, and each monthly winner is eligible for an additional $25,000 year-end grant. The application involves a simple proposal and a $15 fee. This program could provide Tao Day Spa with $10k in funding for a compelling business initiative, given its focus on a female-led venture in wellness.",
    "url": "https://ambergrantsforwomen.com/",
    "type": "non-repayable (grant/competition)",
    "category": "women-focused"
  },
  {
    "title": "Coralus (formerly SheEO) 0% Interest Venture Loans",
    "description": "A community-funded program where women and non-binary entrepreneurs receive five-year, zero-interest loans (approximately $100,000 each) through a democratic selection process. The loans are repaid into a perpetual fund to support future cohorts. Coralus focuses on ventures with a social or environmental impact. If Tao Day Spa demonstrates strong community impact or innovation in organic wellness, it could be selected as a venture and receive a 0% loan plus mentorship from the Coralus network.",
    "url": "https://coralus.world/",
    "type": "loans and financing (zero-interest loan)",
    "category": "women-focused"
  },
  {
    "title": "EDC Women in Trade – Inclusive Trade Investments Program",
    "description": "Export Development Canada's Women in Trade initiatives offer financial solutions and resources for women-led businesses looking to expand internationally. For example, the Inclusive Trade Investments Program provides equity capital to help women-owned companies overcome financing gaps. While Tao Day Spa is a local business, if it develops products (e.g., organic skincare) to export or seeks international clients, EDC's program could assist with financing or investment readiness tailored to women entrepreneurs.",
    "url": "https://www.edc.ca/en/about-us/women-in-trade.html",
    "type": "equity financing / support",
    "category": "women-focused"
  },
  {
    "title": "Zensurance Small Business Grant",
    "description": "An annual small business grant contest open to entrepreneurs across Canada (not limited to women). Zensurance awards a $10,000 grant to one Canadian small business and additional $1,000 grants to five runners-up. The 2024 application window ran from early September to early November. This competition emphasizes innovation and community impact. Tao Day Spa could apply to pitch its organic wellness services for a chance to win $10k to invest in the business.",
    "url": "https://www.zensurance.com/blog/15-business-grants-and-loans-for-women-in-canada#small-business-grant",
    "type": "non-repayable (contest grant)",
    "category": "competitions and awards"
  },
  {
    "title": "FedEx Small Business Grant Contest (Canada)",
    "description": "A national contest that provides significant grant funding to winning small businesses. In its 2024 edition, FedEx Canada awarded a grand prize of $50,000 and additional grants of $20,000 to nine other winners. Typically, about 10 Canadian businesses are selected each year, receiving funding and FedEx services. If the contest runs in 2025, Tao Day Spa can enter by sharing its business story and plans, aiming to win funding (previous prizes ranged up to $30k for second place).",
    "url": "https://www.fedex.com/en-ca/small-business/grant-contest.html",
    "type": "non-repayable (grant contest)",
    "category": "competitions and awards"
  },
  {
    "title": "TELUS #StandWithOwners Small Business Contest",
    "description": 'A large annual competition by TELUS for Canadian small businesses with "passion, purpose and perseverance." Winners receive substantial funding, technology, and marketing support. In 2024 (its 5th year), the top prize included $200,000 in funding along with national media recognition. Additional prizes (e.g. $25,000 packages) are often awarded to other finalists. Tao Day Spa could apply by detailing its story and community impact for a chance to win a significant boost in capital and exposure.',
    "url": "https://www.telus.com/en/business/small-business/stand-with-owners",
    "type": "non-repayable (contest award)",
    "category": "competitions and awards"
  },
  {
    "title": "Small Business BC Awards",
    "description": "British Columbia's premier small business recognition program. Businesses can be nominated in categories such as Business Impact, E-commerce Experience, etc. Winners of each category receive a cash prize (e.g., $5,000 for each category winner in recent years), plus a package of business services and publicity. For 2024, four categories were open, each awarding $5k to the winner. Tao Day Spa could be nominated (or self-nominate) for an award, gaining provincial recognition and prize money if it wins.",
    "url": "https://smallbusinessbc.ca/awards/",
    "type": "non-repayable (award grant)",
    "category": "competitions and awards"
  },
  {
    "title": "Canada Digital Adoption Program – Grow Your Business Online",
    "description": "A federal grant to help small businesses adopt e-commerce and digital tools. Eligible businesses can receive a micro-grant of up to $2,400 to offset costs of going digital (e.g. setting up online booking or an e-commerce site). Tao Day Spa can use this grant to enhance its online presence, such as an improved website for bookings or online sales of organic products. The program is open across Canada and also provides e-commerce advisory support.",
    "url": "https://ised-isde.canada.ca/site/canada-digital-adoption-program/en",
    "type": "non-repayable (grant)",
    "category": "small business support"
  },
  {
    "title": "B.C. Employer Training Grant (ETG)",
    "description": "A provincial program that reimburses employers for a portion of employee training costs. Businesses in B.C. can receive between 60% and 100% of training expenses covered, up to $300,000 per year. The ETG supports skills development via courses, workshops or third-party training for new or existing staff. Tao Day Spa could utilize this to train employees in advanced esthetics techniques or new wellness services, recovering a significant share of the tuition or training fees.",
    "url": "https://www.workbc.ca/Employer-Resources/BC-Employer-Training-Grant.aspx",
    "type": "non-repayable (reimbursement)",
    "category": "hiring and training incentives"
  },
  {
    "title": "Canada Summer Jobs (CSJ)",
    "description": "A federal wage-subsidy program to encourage hiring youth (15–30 years old) for summer positions. For-profit businesses like Tao Day Spa can receive funding for up to 50% of the provincial minimum hourly wage for each summer student hired (non-profits get up to 100%). Positions must be full-time (30–40 hours/week) for 6–16 weeks during the summer. By participating, Tao Day Spa could afford to hire and mentor a student (e.g., as a spa assistant or marketing intern) at half the usual wage cost.",
    "url": "https://www.canada.ca/en/employment-social-development/services/funding/youth-summer-job.html",
    "type": "wage subsidy",
    "category": "hiring and training incentives"
  },
  {
    "title": "WorkBC Wage Subsidy Program",
    "description": "A B.C. program that helps employers hire and train new staff by covering a portion of the employee's wages for up to 24 weeks. Employers can be reimbursed for a negotiated percentage of wages while the new employee gains on-the-job experience and training. This subsidy, available through WorkBC Centers, could assist Tao Day Spa in hiring an additional esthetician or receptionist, offsetting labor costs during the training period. The program may also include support for hiring individuals from underrepresented groups or those facing barriers to employment.",
    "url": "https://www.workbc.ca/Employment-Services/WorkBC-Centres/WorkBC-Wage-Subsidy.aspx",
    "type": "wage subsidy",
    "category": "hiring and training incentives"
  },
  {
    "title": "Student Work Placement Program (SWPP)",
    "description": "A federal program that provides wage subsidies to employers who hire post-secondary students on work terms. Businesses can receive up to $7,000 per student placement to cover a portion of wages (generally 50% of wages up to $5,000, or 70% up to $7,000 for under-represented students). SWPP is delivered through partner organizations (such as Magnet, ICTC, etc.) across various industries. Tao Day Spa could leverage SWPP to hire a co-op or internship student (for example, a marketing student to boost its social media presence) at a significantly reduced cost.",
    "url": "https://www.canada.ca/en/employment-social-development/programs/student-work-placement-program.html",
    "type": "wage subsidy",
    "category": "hiring and training incentives"
  },
  {
    "title": "Apprenticeship Job Creation Tax Credit (Federal)",
    "description": "A federal tax credit for employers who hire apprentices in Red Seal trades. The credit equals 10% of eligible apprentice wages, up to $2,000 per year per apprentice. If Tao Day Spa hires an apprentice in a relevant trade (e.g., hairstylist if the spa offers hair services and the trade is designated), it can claim this non-refundable credit on its tax return, effectively reducing taxes owed by up to $2,000 annually for that apprentice.",
    "url": "https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/credits/ajctc.html",
    "type": "tax incentive (credit)",
    "category": "hiring and tax incentives"
  },
  {
    "title": "B.C. Employer Training Tax Credit (Apprentices)",
    "description": "A refundable provincial tax credit for employers in B.C. who hire and train apprentices in eligible programs. This credit provides financial support for each level of apprenticeship completed and was recently extended until at least the end of 2027. If Tao Day Spa takes on an apprentice (for instance, in a cosmetology or hairstyling program recognized by SkilledTradesBC), it can receive provincial tax credits as the apprentice reaches certain training milestones. This incentive helps offset the costs of apprenticeship training by returning funds to the employer via the tax system.",
    "url": "https://www2.gov.bc.ca/gov/content/taxes/income-taxes/corporate/credits/training/employer",
    "type": "tax incentive (refundable credit)",
    "category": "hiring and tax incentives"
  },
  {
    "title": "BC Hydro – Business Energy Saving Incentives (BESI)",
    "description": "BC Hydro offers financial incentives to commercial customers for energy-efficient equipment upgrades. Eligible businesses can receive up to 25% of the cost of upgrading lighting, HVAC, refrigeration, or other energy-intensive systems to high-efficiency models. These incentives reduce the upfront cost and shorten the payback period of green upgrades. For example, Tao Day Spa could upgrade to LED lighting or efficient water heaters and have a portion of the project costs covered by BC Hydro incentives, lowering energy bills and supporting sustainability goals.",
    "url": "https://www.bchydro.com/powersmart/business/programs/business-energy-saving-incentives.html",
    "type": "non-repayable (rebate/incentive)",
    "category": "green and sustainability initiatives"
  },
  {
    "title": "FortisBC Energy Efficiency Rebates (Commercial)",
    "description": "FortisBC provides rebates to businesses that upgrade to energy-efficient natural gas equipment. Incentives range widely—for example, rebates from $75 up to $6,600 for replacing old commercial kitchen, laundry, or water-heating equipment with high-efficiency models. Additionally, FortisBC offers rebates (often $100–$150 per unit) for installing high-efficiency lighting and HVAC controls. If Tao Day Spa uses natural gas for water heating, laundry, or heating, it could tap into these rebates when purchasing efficient appliances, reducing the capital cost of sustainable upgrades.",
    "url": "https://betterbuildingsbc.ca/incentives/fortisbc-commercial-equipment-upgrades/",
    "type": "non-repayable (rebate)",
    "category": "green and sustainability initiatives"
  },
  {
    "title": "CleanBC Go Electric Vehicle Rebate (Business Fleet)",
    "description": "CleanBC's Go Electric program encourages the adoption of zero-emission vehicles (ZEVs) in B.C. Small businesses can receive up to $3,000 off the purchase or lease of a new electric vehicle (provincial rebate), which can be combined with the federal iZEV rebate of up to $5,000 for a total of $8,000 in incentives on a single EV. For Tao Day Spa, this could be relevant if the business needs a vehicle (e.g., for mobile services or product deliveries) – switching to an EV would come with substantial upfront discounts. Additionally, rebates are available for installing EV charging stations at workplaces, which could benefit the spa's customers and staff.",
    "url": "https://goelectricbc.gov.bc.ca/",
    "type": "rebate (point-of-sale and post-purchase)",
    "category": "green and sustainability initiatives"
  },
  {
    "title": "CanExport SMEs Program",
    "description": "A federal grant program that funds export development activities for small and medium-sized enterprises. CanExport covers 50% of eligible project costs (such as international marketing, trade shows, market research, IP protection) up to a maximum of $50,000 per project. To qualify, a business must have $100k–$100M in revenue and under 500 employees. If Tao Day Spa creates its own line of organic skincare products and seeks overseas distributors or spa partners, it could use CanExport to finance international marketing efforts. (Minimum project spend is $20k, yielding a $10k+ reimbursement).",
    "url": "https://tradecommissioner.gc.ca/funding/canexport/sme-pme/index.aspx",
    "type": "non-repayable (grant, cost-reimbursement)",
    "category": "industry-specific (business expansion/export)"
  },
  {
    "title": "Mastercard x Pier Five Small Business Fund",
    "description": 'A private grant initiative launched by Mastercard in partnership with Pier Five, targeting Canadian women small business owners. The fund awards $10,000 CAD grants to 10 women-led businesses, along with a "Priceless" business mentorship experience in Toronto. Recipients gain access to a network of peers and experts to help fuel their growth. Announced in February 2025, this program underscores support for women entrepreneurs in various sectors (tech, wellness, etc.). Tao Day Spa\'s owner could apply for a chance to receive $10k and high-profile mentorship to scale the business.',
    "url": "https://www.mastercard.ca/en-ca/business/small-business/pier-five-fund.html",
    "type": "non-repayable (grant)",
    "category": "women-focused"
  },
  {
    "title": "Tourism Innovation Lab \"Spark\" Mentorships & Grants",
    "description": "A program to spur innovative tourism ideas in British Columbia. The \"Spark\" program, run in collaboration with Destination BC and regional partners, provides a $3,000 seed grant and 3-month mentorship to selected tourism entrepreneurs and small businesses. The goal is to develop new tourism experiences or services. If Tao Day Spa proposes a creative wellness tourism experience (for example, an authentic spa package for visitors or a cultural wellness tour in Steveston), it could win funding and expert mentorship to bring that idea to life. Calls for applications are region-specific and were open in early 2024 for certain corridors.",
    "url": "https://www.tourisminnovation.ca/bc-spark",
    "type": "non-repayable (seed grant and mentorship)",
    "category": "competitions and awards; industry-specific (tourism)"
  },
  {
    "title": "Canada Digital Adoption Program – Boost Your Business Technology",
    "description": "The second stream of CDAP that helps SMEs adopt complex digital technologies. Eligible businesses can receive up to $15,000 in grants (covering 90% of costs) to hire a certified digital advisor who will develop a Digital Adoption Plan. After completing the plan, the business becomes eligible for a zero-interest BDC loan of up to $100,000 to implement the plan's recommendations. For Tao Day Spa, this could mean engaging an advisor to plan a technology upgrade (like a new booking system, CRM, or advanced spa equipment) at minimal cost, then accessing interest-free financing to purchase and implement those digital solutions.",
    "url": "https://ised-isde.canada.ca/site/canada-digital-adoption-program/en/boost-your-business-technology",
    "type": "mixed (grant for advisory + 0% loan)",
    "category": "small business support; digital adoption"
  }
];

function DialogModalContent() {
  const [starredOpportunities, setStarredOpportunities] = useState<Set<number>>(new Set())
  const [activeCategory, setActiveCategory] = useState<string>("")
  const categoryRefs = useRef<Record<string, HTMLDivElement>>({})

  const toggleStar = (index: number, event: ReactMouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()
    setStarredOpportunities((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(index)) {
        newSet.delete(index)
      } else {
        newSet.add(index)
      }
      return newSet
    })
  }

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
          <p className="text-xl text-gray-600 mb-8">For Tao Day Spa (Steveston, BC)</p>

          <div className="sticky top-0 bg-gray-50 py-4 z-10 flex items-center gap-4">
            <Select
              value={activeCategory}
              onValueChange={(value) => scrollToCategory(value)}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(groupedOpportunities).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)} ({groupedOpportunities[category].length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex-1 overflow-x-auto">
              <div className="flex gap-2">
                {Object.keys(groupedOpportunities).map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
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
                        <div className="flex justify-between items-start">
                          <CardTitle className={`text-lg font-semibold text-gray-900 ${index > 0 ? "blur-sm select-none" : ""}`}>
                            {opportunity.title}
                          </CardTitle>
                          <button
                            onClick={(e) => toggleStar(index, e)}
                            className="text-gray-400 hover:text-yellow-400 transition-colors duration-300"
                            aria-label={
                              starredOpportunities.has(index) ? "Unstar this opportunity" : "Star this opportunity"
                            }
                          >
                            <Star
                              className={`w-5 h-5 ${starredOpportunities.has(index) ? "fill-yellow-400 text-yellow-400" : "fill-transparent"}`}
                            />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        <p className={`text-sm text-gray-600 mb-4 ${index > 0 ? "blur-sm select-none" : ""}`}>
                          {opportunity.description}
                        </p>
                        <div className="space-y-2 text-xs text-gray-500">
                          <p>
                            <span className="font-semibold">Type:</span> {opportunity.type}
                          </p>
                          {opportunity.deadline && (
                            <p>
                              <span className="font-semibold">Deadline:</span> {opportunity.deadline}
                            </p>
                          )}
                          {opportunity.notes && (
                            <p>
                              <span className="font-semibold">Notes:</span> {opportunity.notes}
                            </p>
                          )}
                        </div>
                        {index === 0 && (
                          <div className="mt-4 text-sm text-gray-500 italic">
                            Full details available in your personalized report
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
            <Button variant="outline" onClick={() => setOpen(true)}>
              Get Started
            </Button>
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
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <Button size="lg" className="text-lg px-8 h-14 rounded-full">
                      Get Your Grant Report <ArrowRight className="ml-2" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Tell Us About Your Business</DialogTitle>
                      <DialogDescription>
                        Help us find the best grants for your business by providing some details.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                      {/* Business Name and Location */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Business Details</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <Input 
                              {...form.register("businessName")}
                              id="businessName" 
                              placeholder="Enter your business name" 
                            />
                            {form.formState.errors.businessName && (
                              <p className="text-sm text-red-500">{form.formState.errors.businessName.message}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input 
                              {...form.register("email")}
                              id="email" 
                              type="email"
                              placeholder="Enter your email address" 
                            />
                            {form.formState.errors.email && (
                              <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="city">City</Label>
                            <Input 
                              {...form.register("city")}
                              id="city" 
                              placeholder="City" 
                            />
                            {form.formState.errors.city && (
                              <p className="text-sm text-red-500">{form.formState.errors.city.message}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="province">Province/Territory</Label>
                            <Select onValueChange={(value) => form.setValue("province", value)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select province/territory" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="AB">Alberta</SelectItem>
                                <SelectItem value="BC">British Columbia</SelectItem>
                                <SelectItem value="MB">Manitoba</SelectItem>
                                <SelectItem value="NB">New Brunswick</SelectItem>
                                <SelectItem value="NL">Newfoundland and Labrador</SelectItem>
                                <SelectItem value="NS">Nova Scotia</SelectItem>
                                <SelectItem value="NT">Northwest Territories</SelectItem>
                                <SelectItem value="NU">Nunavut</SelectItem>
                                <SelectItem value="ON">Ontario</SelectItem>
                                <SelectItem value="PE">Prince Edward Island</SelectItem>
                                <SelectItem value="QC">Quebec</SelectItem>
                                <SelectItem value="SK">Saskatchewan</SelectItem>
                                <SelectItem value="YT">Yukon</SelectItem>
                              </SelectContent>
                            </Select>
                            {form.formState.errors.province && (
                              <p className="text-sm text-red-500">{form.formState.errors.province.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Business Type and Industry */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Business Type & Industry</h3>
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <Label>Business Type</Label>
                            <RadioGroup 
                              defaultValue="for-profit" 
                              className="flex gap-4"
                              onValueChange={(value) => form.setValue("businessType", value as "for-profit" | "non-profit")}
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="for-profit" id="for-profit" />
                                <Label htmlFor="for-profit">For-Profit</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="non-profit" id="non-profit" />
                                <Label htmlFor="non-profit">Non-Profit</Label>
                              </div>
                            </RadioGroup>
                            {form.formState.errors.businessType && (
                              <p className="text-sm text-red-500">{form.formState.errors.businessType.message}</p>
                            )}
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Select 
                              onValueChange={(value) => {
                                form.setValue("industry", value);
                                setShowOtherIndustry(value === "other");
                                if (value !== "other") {
                                  form.setValue("otherIndustry", "");
                                }
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="wellness">Health & Wellness</SelectItem>
                                <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                                <SelectItem value="tech">Technology</SelectItem>
                                <SelectItem value="retail">Retail</SelectItem>
                                <SelectItem value="food">Food & Beverage</SelectItem>
                                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                                <SelectItem value="professional">Professional Services</SelectItem>
                                <SelectItem value="arts">Arts & Entertainment</SelectItem>
                                <SelectItem value="education">Education</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            {showOtherIndustry && (
                              <div className="mt-2">
                                <Input 
                                  {...form.register("otherIndustry")}
                                  placeholder="Please specify your industry"
                                />
                                {form.formState.errors.otherIndustry && (
                                  <p className="text-sm text-red-500">{form.formState.errors.otherIndustry.message}</p>
                                )}
                              </div>
                            )}
                            {form.formState.errors.industry && (
                              <p className="text-sm text-red-500">{form.formState.errors.industry.message}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Business Stage */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Business Stage</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label>Current Stage</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select business stage" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="startup">Startup</SelectItem>
                                <SelectItem value="established">Established</SelectItem>
                                <SelectItem value="expanding">Expanding</SelectItem>
                                <SelectItem value="pivoting">Pivoting/Transforming</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="startDate">Business Start Date</Label>
                            <Input type="date" id="startDate" />
                          </div>
                        </div>
                      </div>

                      {/* Owner Demographics */}
                      <div className="space-y-4">
                        <h3 className="font-semibold">Owner Demographics</h3>
                        <div className="grid gap-4">
                          <div className="grid gap-2">
                            <Label>Gender</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="non-binary">Non-binary</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="grid gap-2">
                            <Label>Age Range</Label>
                            <Select>
                              <SelectTrigger>
                                <SelectValue placeholder="Select age range" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="18-24">18-24</SelectItem>
                                <SelectItem value="25-34">25-34</SelectItem>
                                <SelectItem value="35-44">35-44</SelectItem>
                                <SelectItem value="45-54">45-54</SelectItem>
                                <SelectItem value="55-64">55-64</SelectItem>
                                <SelectItem value="65+">65+</SelectItem>
                                <SelectItem value="prefer-not">Prefer not to say</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Underrepresented Groups (Optional)</Label>
                            <div className="grid gap-2">
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="indigenous" 
                                  className="rounded border-gray-300"
                                  {...form.register("underrepresentedGroups")}
                                  value="indigenous"
                                />
                                <Label htmlFor="indigenous">Indigenous</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="visible-minority" 
                                  className="rounded border-gray-300"
                                  {...form.register("underrepresentedGroups")}
                                  value="visible-minority"
                                />
                                <Label htmlFor="visible-minority">Visible Minority</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="newcomer" 
                                  className="rounded border-gray-300"
                                  {...form.register("underrepresentedGroups")}
                                  value="newcomer"
                                />
                                <Label htmlFor="newcomer">Newcomer to Canada</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="disability" 
                                  className="rounded border-gray-300"
                                  {...form.register("underrepresentedGroups")}
                                  value="disability"
                                />
                                <Label htmlFor="disability">Person with Disability</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="veteran" 
                                  className="rounded border-gray-300"
                                  {...form.register("underrepresentedGroups")}
                                  value="veteran"
                                />
                                <Label htmlFor="veteran">Veteran</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <input 
                                  type="checkbox" 
                                  id="other" 
                                  className="rounded border-gray-300"
                                  checked={showOtherField}
                                  onChange={(e) => {
                                    setShowOtherField(e.target.checked);
                                    if (!e.target.checked) {
                                      form.setValue("otherUnderrepresentedGroup", "");
                                    }
                                  }}
                                />
                                <Label htmlFor="other">Other</Label>
                              </div>
                              {showOtherField && (
                                <div className="ml-6">
                                  <Input 
                                    {...form.register("otherUnderrepresentedGroup")}
                                    placeholder="Please specify"
                                    className="mt-2"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                          {form.formState.isSubmitting ? "Processing..." : "Continue to Payment"}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
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
                    <DialogModalContent />
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

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => setOpen(true)}
                >
                  Get Your Report
                </Button>
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