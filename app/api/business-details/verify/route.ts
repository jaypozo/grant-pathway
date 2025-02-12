import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const businessDetailsId = searchParams.get('bid');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("grantPathway");
    
    // Find user by token
    const user = await db.collection("users").findOne({
      token,
      tokenExpiresAt: { $gt: new Date() }
    });

    if (!user) {
      return NextResponse.json({ error: 'Token expired' }, { status: 404 });
    }

    // Get business details
    let businessDetails;
    if (businessDetailsId) {
      // Get specific business details if ID provided
      businessDetails = await db.collection("businessDetails")
        .find({ 
          _id: new ObjectId(businessDetailsId),
          userId: user._id 
        })
        .project({
          businessName: 1,
          city: 1,
          province: 1,
          businessType: 1,
          industry: 1,
          otherIndustry: 1,
          businessStage: 1,
          startDate: 1,
          gender: 1,
          ageRange: 1,
          underrepresentedGroups: 1,
          otherUnderrepresentedGroup: 1,
          status: 1,
          createdAt: 1
        })
        .toArray();
    } else {
      // Get all business details for this user
      businessDetails = await db.collection("businessDetails")
        .find({ userId: user._id })
        .project({
          businessName: 1,
          city: 1,
          province: 1,
          businessType: 1,
          industry: 1,
          otherIndustry: 1,
          businessStage: 1,
          startDate: 1,
          gender: 1,
          ageRange: 1,
          underrepresentedGroups: 1,
          otherUnderrepresentedGroup: 1,
          status: 1,
          createdAt: 1
        })
        .sort({ createdAt: -1 }) // Most recent first
        .toArray();
    }

    // Remove sensitive fields from user
    const safeUser = {
      email: user.email,
      createdAt: user.createdAt
    };

    return NextResponse.json({ 
      user: safeUser,
      businessDetails
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    return NextResponse.json(
      { error: 'Failed to verify token' },
      { status: 500 }
    );
  }
} 