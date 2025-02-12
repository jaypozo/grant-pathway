import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    const businessDetailsId = searchParams.get('bid');

    if (!token || !businessDetailsId) {
      return NextResponse.json({ error: 'Token and business ID are required' }, { status: 400 });
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
    const businessDetails = await db.collection("businessDetails").findOne({
      _id: new ObjectId(businessDetailsId),
      userId: user._id
    });

    if (!businessDetails) {
      return NextResponse.json({ error: 'Business details not found' }, { status: 404 });
    }

    // Get report items
    const reportItems = await db.collection("reportItems")
      .find({ businessId: new ObjectId(businessDetailsId) })
      .sort({ category: 1, title: 1 })
      .toArray();

    // Transform business details for the response
    const businessResponse = {
      businessName: businessDetails.businessName,
      city: businessDetails.city,
      province: businessDetails.province,
      reportUploadedAt: businessDetails.reportUploadedAt,
    };

    // Transform report items for the response
    const reportItemsResponse = reportItems.map(item => ({
      id: item._id.toString(),
      title: item.title,
      description: item.description,
      url: item.url,
      type: item.type,
      category: item.category,
      deadline: item.deadline,
      max_amount: item.max_amount,
      funding_provider: item.funding_provider,
    }));

    return NextResponse.json({
      businessDetails: businessResponse,
      reportItems: reportItemsResponse,
    });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json(
      { error: 'Failed to fetch report' },
      { status: 500 }
    );
  }
} 