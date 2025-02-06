'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
            <img src="/images/logo.png" alt="Grant Pathway" className="h-8" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          {user && businessDetails.length > 0 ? (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">Welcome Back, {user.email}!</h1>
                <p className="text-lg text-muted-foreground">
                  {businessDetailsId 
                    ? "Here are your business details and report status."
                    : "Here are all your business details and report statuses."}
                </p>
              </div>

              {businessDetails.map((details, index) => (
                <Card key={index} className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-semibold">Business Details</h2>
                    <div className="text-sm">
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
                        {details.status}
                      </span>
                    </div>
                  </div>
                  <dl className="grid gap-4">
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Name</dt>
                      <dd className="text-lg">{details.businessName}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Location</dt>
                      <dd>{details.city}, {details.province}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Type</dt>
                      <dd>{details.businessType}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Industry</dt>
                      <dd>{details.otherIndustry || details.industry}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Business Stage</dt>
                      <dd>{details.businessStage}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-muted-foreground">Submitted On</dt>
                      <dd>{new Date(details.createdAt).toLocaleDateString()}</dd>
                    </div>
                  </dl>
                </Card>
              ))}

              <div className="text-center text-muted-foreground">
                <p>Bookmark this page or check your email for updates about your report.</p>
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