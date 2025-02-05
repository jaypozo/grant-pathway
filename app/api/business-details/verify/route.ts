import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("grantPathway");
    
    const businessDetails = await db.collection("businessDetails").findOne({
      token,
      tokenExpiresAt: { $gt: new Date() }
    });

    if (!businessDetails) {
      return NextResponse.json({ error: 'Token expired' }, { status: 404 });
    }

    // Remove sensitive fields before sending
    const { token: _, tokenExpiresAt: __, _id: ___, ...safeBusinessDetails } = businessDetails;

    return NextResponse.json({ businessDetails: safeBusinessDetails });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
} 