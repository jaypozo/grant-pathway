'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Star, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ViewReportItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: string;
  category: string;
  deadline?: string;
  max_amount?: string;
  funding_provider?: string;
}

interface BusinessDetails {
  businessName: string;
  city: string;
  province: string;
  reportUploadedAt: string;
}

export default function ReportPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const businessDetailsId = searchParams.get('bid');
  
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails | null>(null);
  const [reportItems, setReportItems] = useState<ViewReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token && businessDetailsId) {
      fetchReport();
    } else {
      setLoading(false);
      setError('Invalid report URL');
    }
  }, [token, businessDetailsId]);

  const fetchReport = async () => {
    try {
      const response = await fetch(`/api/report?token=${token}&bid=${businessDetailsId}`);
      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
        setBusinessDetails(null);
        setReportItems([]);
      } else {
        setBusinessDetails(data.businessDetails);
        setReportItems(data.reportItems);
        setError(null);
      }
    } catch (err) {
      setError('Failed to fetch report');
      setBusinessDetails(null);
      setReportItems([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary/20" />
          <p className="text-muted-foreground">Loading your report...</p>
        </div>
      </div>
    );
  }

  if (error || !businessDetails || reportItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <h1 className="text-3xl font-bold mb-4">Report Not Found</h1>
          <p className="text-muted-foreground mb-8">
            {error || 'This report is not available or has expired.'}
          </p>
          <Link href="/">
            <Button className="w-full">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Group report items by category
  const groupedItems = reportItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ViewReportItem[]>);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center">
          <img src="/images/logo.png" alt="Grant Pathway" className="h-8" />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Report Header */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold mb-2">Funding Opportunities Report</h1>
            <p className="text-lg text-muted-foreground">
              Prepared for {businessDetails.businessName} in {businessDetails.city}, {businessDetails.province}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Report generated on {new Date(businessDetails.reportUploadedAt).toLocaleDateString()}
            </p>
          </div>

          {/* Report Content */}
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, items]) => (
              <section key={category} id={category.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-20">
                <h2 className="text-2xl font-semibold mb-6">{category} ({items.length})</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  {items.map((item) => (
                    <Card key={item.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold">{item.title}</h3>
                            {item.funding_provider && (
                              <p className="text-muted-foreground">by {item.funding_provider}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                              <Star className="w-5 h-5" />
                            </Button>
                            <Button variant="outline" asChild>
                              <a href={item.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                View Details <ArrowRight className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>

                        <p className="text-muted-foreground">{item.description}</p>

                        <div className="flex flex-wrap gap-6 text-sm">
                          {item.type && (
                            <div>
                              <dt className="font-medium text-gray-600 mb-1">Type</dt>
                              <dd className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                                {item.type}
                              </dd>
                            </div>
                          )}
                          {item.max_amount && (
                            <div>
                              <dt className="font-medium text-gray-600 mb-1">⚡ Maximum Amount</dt>
                              <dd className="text-emerald-600">{item.max_amount}</dd>
                            </div>
                          )}
                          {item.deadline && (
                            <div>
                              <dt className="font-medium text-gray-600 mb-1">⏰ Deadline</dt>
                              <dd className="text-gray-600">{item.deadline}</dd>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 