import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

if (!webhookSecret) {
  throw new Error('STRIPE_WEBHOOK_SECRET is required');
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature provided' },
      { status: 400 }
    );
  }

  let data;
  let eventType;
  let event;

  // Verify Stripe event is legitimate
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  data = event.data;
  eventType = event.type;

  try {
    switch (eventType) {
      case 'checkout.session.completed': {
        console.log('Processing checkout.session.completed');
        const session = event.data.object as Stripe.Checkout.Session;
        
        // Get the business details ID from metadata
        const businessDetailsId = session.metadata?.businessDetailsId;
        
        if (!businessDetailsId) {
          console.error('No business details ID in metadata');
          throw new Error('No business details ID in metadata');
        }

        // Update business details status
        const client = await clientPromise;
        const db = client.db("grantPathway");
        
        const result = await db.collection("businessDetails").updateOne(
          { _id: new ObjectId(businessDetailsId) },
          { 
            $set: { 
              status: 'processing_report',
              paidAt: new Date(),
              paymentId: session.payment_intent as string
            }
          }
        );

        if (result.matchedCount === 0) {
          console.error('No business details found with ID:', businessDetailsId);
          throw new Error('Business details not found');
        }

        console.log('Successfully processed checkout.session.completed for session:', session.id);
        break;
      }
      default:
        console.log(`Unhandled event type ${eventType}`);
    }
  } catch (error) {
    console.error('Error processing webhook:', error);
    // We still return 200 to acknowledge receipt of the webhook
    // This prevents Stripe from retrying the webhook unnecessarily
  }

  // Return 200 to acknowledge receipt of the webhook
  return NextResponse.json({});
} 