import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import AdmissionQuery from '@/lib/models/AdmissionQuery';
import Test from '@/lib/models/Test';
import Class from '@/lib/models/Class';

// Helper to redirect to error page with code
function redirectToError(request: NextRequest, errorCode: string) {
  // Redirect to a generic test page with error parameter
  // The TestTakingClient will handle displaying the appropriate error
  const baseUrl = request.nextUrl.origin;
  return NextResponse.redirect(new URL(`/tests/error?error=${errorCode}`, baseUrl));
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return redirectToError(request, 'missing_token');
    }

    // First check if this token was already used (test completed)
    // This handles cases where token is removed after completion
    const completedAdmission = await AdmissionQuery.findOne({
      testToken: token,
      testCompleted: true
    });

    if (completedAdmission) {
      return redirectToError(request, 'already_completed');
    }

    // Find and validate active admission
    const admission = await AdmissionQuery.findOne({
      testToken: token,
      status: { $in: ['test_sent', 'contacted'] }
    });

    if (!admission) {
      return redirectToError(request, 'access_required');
    }

    // Check if token is expired
    if (admission.testTokenExpiry && new Date() > admission.testTokenExpiry) {
      return redirectToError(request, 'access_required');
    }

    // Find the class by name (case-insensitive)
    const classDoc = await Class.findOne({
      name: { $regex: new RegExp(admission.class, 'i') }
    });

    if (!classDoc) {
      return redirectToError(request, 'no_test_available');
    }

    // Find an active test for this class
    const test = await Test.findOne({ class: classDoc._id, isActive: true });

    if (!test) {
      return redirectToError(request, 'no_test_available');
    }

    // Redirect to the test page
    const testId = test._id.toString();
    const baseUrl = request.nextUrl.origin;
    return NextResponse.redirect(new URL(`/tests/${testId}?token=${token}`, baseUrl));

  } catch (error) {
    console.error('Error redirecting to test:', error);
    return redirectToError(request, 'server_error');
  }
}
