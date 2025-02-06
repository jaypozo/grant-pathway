import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import crypto from 'crypto';
import { sendTemplateEmail } from '@/lib/mailgun';

export const dynamic = 'force-dynamic';

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("grantPathway");
    
    // Find the business details by email
    const businessDetails = await db.collection("businessDetails").findOne({ email });

    if (!businessDetails) {
      return NextResponse.json({ error: 'No business details found for this email' }, { status: 404 });
    }

    // Generate new token and expiry
    const token = generateToken();
    const tokenExpiresAt = new Date();
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30);

    // Update the document with new token
    await db.collection("businessDetails").updateOne(
      { _id: businessDetails._id },
      { 
        $set: { 
          token,
          tokenExpiresAt
        }
      }
    );

    const reportLink = `${process.env.NEXT_PUBLIC_BASE_URL}/success?token=${token}`;
    
    // Send magic link email using template
    await sendTemplateEmail({
      to: email,
      subject: 'Your Grant Pathway Report Access Link',
      template: 'report payment success',
      variables: {
        businessName: businessDetails.businessName,
        location: `${businessDetails.city}, ${businessDetails.province}`,
        industry: businessDetails.otherIndustry || businessDetails.industry,
        reportLink
      }
    });

    return NextResponse.json({ 
      success: true,
      message: 'Magic link has been sent to your email'
    });
  } catch (error) {
    console.error('Error requesting magic link:', error);
    return NextResponse.json(
      { error: 'Failed to generate magic link' },
      { status: 500 }
    );
  }
} 