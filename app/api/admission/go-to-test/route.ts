import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import Test from '@/lib/models/Test';
import Class from '@/lib/models/Class';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Token is required' },
        { status: 400 }
      );
    }

    // Find and validate admission
    const admission = await AdmissionQuery.findOne({ 
      testToken: token,
      status: { $in: ['test_sent', 'contacted'] }
    });

    if (!admission) {
      return NextResponse.json(
        { error: 'Invalid or expired test token' },
        { status: 404 }
      );
    }

    // Check if token is expired
    if (admission.testTokenExpiry && new Date() > admission.testTokenExpiry) {
      return NextResponse.json(
        { error: 'Test link has expired' },
        { status: 410 }
      );
    }

    // Check if test was already attempted
    if (admission.testScore !== undefined && admission.testScore !== null) {
      return NextResponse.json(
        { error: 'Test has already been completed' },
        { status: 403 }
      );
    }

    // Find the class by name (case-insensitive)
    const classDoc = await Class.findOne({ 
      name: { $regex: new RegExp(admission.class, 'i') } 
    });
    
    if (!classDoc) {
      return NextResponse.json(
        { error: 'No test available for this class' },
        { status: 404 }
      );
    }

    // Find an active test for this class
    const test = await Test.findOne({ class: classDoc._id, isActive: true });
    
    if (!test) {
      return NextResponse.json(
        { error: 'No active test found for this class' },
        { status: 404 }
      );
    }

    // Redirect to the test page
    const testId = test._id.toString();
    return NextResponse.redirect(new URL(`/tests/${testId}?token=${token}`, request.url));

  } catch (error) {
    console.error('Error redirecting to test:', error);
    return NextResponse.json(
      { error: 'Failed to redirect to test' },
      { status: 500 }
    );
  }
}
