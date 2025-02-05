import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import Stripe from 'stripe';
import crypto from 'crypto';

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
    
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

    // Add timestamp and token to the data
    const businessDetails = {
      ...data,
      createdAt: new Date(),
      status: 'pending_payment',
      token,
      tokenExpiresAt: expiresAt
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
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?token=${token}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/business-details`,
      metadata: {
        businessDetailsId: result.insertedId.toString(),
        token
      },
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      customer_email: data.email,
    });

    if (!session.url) {
      throw new Error('Failed to create checkout session URL');
    }

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