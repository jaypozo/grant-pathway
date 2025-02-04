'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, CheckCircle, Clock, FileText, Users, DollarSign, Sparkles, LightbulbIcon } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Marquee from 'react-fast-marquee';

export default function Home() {
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
                <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent relative">
                  Unlock
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-primary/20 -skew-x-6 transform" />
                </span>
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                Your Business's Grant Potential
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl">
              Get a personalized report of all grants your Canadian business qualifies for, delivered within 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-12">
              <Button size="lg" className="text-lg px-8 h-14 rounded-full">
                Get Your Grant Report <ArrowRight className="ml-2" />
              </Button>
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
      <section className="py-20 px-4 bg-primary/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">What You'll Receive</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
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
                    <CheckCircle className="text-primary shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-lg shadow-xl p-6">
              <img
                src="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80"
                alt="Sample Report"
                className="rounded-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-background">
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
  );
}