"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  const errorConfig: Record<string, { title: string; message: string; action: string }> = {
    missing_token: {
      title: "Invalid Test Link",
      message: "The test link is invalid or incomplete. Test links are valid for 48 hours (2 days) from the time they are sent.",
      action: "Please check your email for the complete test link or contact the school office if your link has expired. You may need to request a new test invitation.",
    },
    access_required: {
      title: "Invalid or Expired Test Link",
      message: "This test link is no longer valid. Test links are valid for 48 hours (2 days) from the time they are sent.",
      action: "Please check your email for a newer test link or contact the school office to request a new test invitation.",
    },
    already_completed: {
      title: "Test Already Completed",
      message: "You have already completed this test. Each student can only take the test once.",
      action: "Please contact the school administration if you need to retake the test or have any questions about your results.",
    },
    no_test_available: {
      title: "No Test Available",
      message: "There is currently no active test available for your class.",
      action: "Please contact the school administration for more information about test scheduling.",
    },
    server_error: {
      title: "Unable to Access Test",
      message: "We couldn't verify your test access at this time. Please try again later.",
      action: "If the problem persists, please contact school administration for assistance.",
    },
  };

  const error = errorConfig[errorCode || ""] || errorConfig.access_required;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-red-800 mb-2">{error.title}</h2>
        <p className="text-red-700 mb-4">{error.message}</p>
        <p className="text-sm text-red-600 bg-red-100/50 rounded-lg p-3 mb-6">{error.action}</p>
        <div className="flex flex-col gap-2">
          <Link
            href="/admissions"
            className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition-colors text-center"
          >
            Apply for Admission
          </Link>
          <Link
            href="/contact"
            className="w-full py-2.5 px-4 bg-white border border-red-200 hover:bg-red-50 text-red-700 font-medium rounded-xl transition-colors text-center"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function TestErrorPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
