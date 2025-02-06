'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Clock, CheckCircle, Mail, Bookmark, Bot, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface User {
  email: string;
  createdAt: string;
}

interface BusinessDetails {
  businessName: string;
  city: string;
  province: string;
  businessType: string;
  industry: string;
  otherIndustry?: string;
  businessStage: string;
  startDate: string;
  gender: string;
  ageRange: string;
  underrepresentedGroups?: string[];
  otherUnderrepresentedGroup?: string;
  status: string;
  createdAt: string;
}

function formatDateTime(date: string) {
  return new Date(date).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZoneName: 'short'
  });
}

function getDeliveryDateTime(submissionDate: string) {
  const deliveryDate = new Date(submissionDate);
  deliveryDate.setHours(deliveryDate.getHours() + 48);
  return formatDateTime(deliveryDate.toString());
}

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const businessDetailsId = searchParams.get('bid');
  
  const [user, setUser] = useState<User | null>(null);
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (token) {
      fetchBusinessDetails();
    } else {
      setLoading(false);
    }
  }, [token, businessDetailsId]);

  const fetchBusinessDetails = async () => {
    try {
      const url = businessDetailsId 
        ? `/api/business-details/verify?token=${token}&bid=${businessDetailsId}`
        : `/api/business-details/verify?token=${token}`;
        
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setUser(null);
        setBusinessDetails([]);
      } else {
        setUser(data.user);
        setBusinessDetails(data.businessDetails);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch business details');
      setUser(null);
      setBusinessDetails([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestNewLink = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/business-details/request-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      if (data.success) {
        setEmailSent(true);
        setError(null);
      } else {
        setError(data.error || 'Failed to send magic link');
      }
    } catch (err) {
      setError('Failed to send magic link');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <Sparkles className="w-8 h-8 text-primary" />
          <p className="text-muted-foreground">Loading your details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center">
          <Link href={process.env.NEXT_PUBLIC_BASE_URL || '/'}>
            <img src="/images/logo.png" alt="Grant Pathway" className="h-8 hover:opacity-90 transition-opacity" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {user && businessDetails.length > 0 ? (
            <div className="space-y-8">
              {/* Success Message */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  <span>Successfully Submitted</span>
                </div>
                <h1 className="text-3xl font-bold">Your Grant Report is Being Generated</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                  Our team is working on finding the perfect funding opportunities for {businessDetails[0].businessName}.
                </p>
              </div>

              {/* Status Card */}
              <Card className="p-6 border-2 border-primary/20 bg-primary/5">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <Bot className="w-8 h-8 text-primary shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-lg mb-2">Our AI is on the Case! 🕵️‍♂️</h3>
                      <p className="text-muted-foreground">
                        Our intelligent systems are scouring the depths of the internet, analyzing hundreds of funding sources to find the perfect matches for your business. It's like having a team of grant-hunting robots working just for you!
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="flex items-start gap-4">
                      <Clock className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Submitted</h4>
                        <p className="text-sm text-muted-foreground">
                          {formatDateTime(businessDetails[0].createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Mail className="w-6 h-6 text-primary shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium mb-1">Delivery</h4>
                        <p className="text-sm text-muted-foreground">
                          Your report will be emailed to {user.email} within 48 hours
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 pt-2 border-t">
                    <div className="bg-background rounded-lg p-4 text-sm w-full">
                      <p className="mb-2">
                        <span className="font-medium">Questions or concerns?</span> We're here to help!
                      </p>
                      <p className="text-primary">
                        Contact us at{' '}
                        <a href="mailto:hello@grantpathway.com" className="underline hover:no-underline">
                          hello@grantpathway.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Business Details Card */}
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Your Business Details</h2>
                    <div className="text-sm text-muted-foreground">
                      We'll use these details to find your opportunities
                    </div>
                  </div>

                  <dl className="grid gap-6 md:grid-cols-2">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                      <dd className="text-lg mt-1">{businessDetails[0].businessName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                      <dd className="text-lg mt-1">{businessDetails[0].city}, {businessDetails[0].province}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Type</dt>
                      <dd className="text-lg mt-1">{businessDetails[0].businessType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                      <dd className="text-lg mt-1">{businessDetails[0].otherIndustry || businessDetails[0].industry}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Stage</dt>
                      <dd className="text-lg mt-1">{businessDetails[0].businessStage}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Start Date</dt>
                      <dd className="text-lg mt-1">{new Date(businessDetails[0].startDate).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </div>
              </Card>

              {/* Next Steps */}
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 text-muted-foreground">
                  <Bookmark className="w-4 h-4" />
                  <span>Bookmark this page for easy access to your report</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  We'll notify you via email when your personalized report is ready.
                </p>
              </div>
            </div>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Access Your Report</h1>
                <p className="text-muted-foreground">
                  {error === 'Token expired' 
                    ? 'Your access link has expired. Enter your email to receive a new link.'
                    : 'Enter your email to receive a magic link to access your report.'}
                </p>
              </div>

              <form onSubmit={handleRequestNewLink} className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-500">{error}</p>}
                {emailSent && (
                  <p className="text-sm text-green-600">
                    Check your email for the magic link to access your report.
                  </p>
                )}

                <Button type="submit" className="w-full">
                  Send Magic Link
                </Button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 