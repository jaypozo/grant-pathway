import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Stripe from 'stripe';
import crypto from 'crypto';
import { sendTemplateEmail } from '@/lib/mailgun';

export const dynamic = 'force-dynamic';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Please add your Stripe secret key to .env.local');
}

if (!process.env.STRIPE_PRICE_ID) {
  throw new Error('Please add your Stripe price ID to .env.local');
}

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  throw new Error('Please add your Stripe publishable key to .env.local');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-01-27.acacia'
});

function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const client = await clientPromise;
    const db = client.db("grantPathway");
    
    // Check for existing valid token
    const existingUser = await db.collection("users").findOne({
      email: data.email,
      tokenExpiresAt: { $gt: new Date() }
    });

    let token;
    let user;

    if (existingUser) {
      // Use existing token
      token = existingUser.token;
      user = existingUser;
    } else {
      // Create new token
      token = generateToken();
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 30);

      // Create or update user
      const result = await db.collection("users").findOneAndUpdate(
        { email: data.email },
        { 
          $setOnInsert: { 
            email: data.email,
            createdAt: new Date()
          },
          $set: {
            token,
            tokenExpiresAt,
            updatedAt: new Date()
          }
        },
        { 
          upsert: true,
          returnDocument: 'after'
        }
      );

      if (!result) {
        throw new Error('Failed to create/update user');
      }
      user = result;
    }

    // Create business details linked to user
    const businessDetails = {
      userId: user._id,
      businessName: data.businessName,
      city: data.city,
      province: data.province,
      businessType: data.businessType,
      industry: data.industry,
      otherIndustry: data.otherIndustry,
      businessStage: data.businessStage,
      startDate: data.startDate,
      gender: data.gender,
      ageRange: data.ageRange,
      underrepresentedGroups: data.underrepresentedGroups,
      otherUnderrepresentedGroup: data.otherUnderrepresentedGroup,
      createdAt: new Date(),
      status: 'pending_payment'
    };

    const result = await db.collection("businessDetails").insertOne(businessDetails);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?token=${token}&bid=${result.insertedId.toString()}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business-details`,
      metadata: {
        businessDetailsId: result.insertedId.toString(),
        userId: user._id.toString(),
        token
      },
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: data.email,
      allow_promotion_codes: true,
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

    // Send confirmation email using template
    const reportLink = `${process.env.NEXT_PUBLIC_BASE_URL}/success?token=${token}&bid=${result.insertedId.toString()}`;
    await sendTemplateEmail({
      to: data.email,
      subject: 'Welcome to Grant Pathway - Payment Confirmation',
      template: 'report payment success',
      variables: {
        businessName: data.businessName,
        location: `${data.city}, ${data.province}`,
        industry: data.otherIndustry || data.industry,
        reportLink
      }
    });

    return NextResponse.json({ 
      success: true, 
      id: result.insertedId,
      redirectUrl: session.url,
      publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    });
  } catch (error) {
    console.error('Error saving business details:', error);
    return NextResponse.json(
      { error: 'Failed to save business details' },
      { status: 500 }
    );
  }
} 