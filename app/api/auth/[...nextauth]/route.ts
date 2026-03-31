import { NextResponse } from 'next/server';

function methodNotImplemented() {
	return NextResponse.json(
		{
			message: 'NextAuth route is disabled. Use /api/auth/login and /api/auth/profile.',
		},
		{ status: 501 }
	);
}

export async function GET() {
	return methodNotImplemented();
}

export async function POST() {
	return methodNotImplemented();
}
