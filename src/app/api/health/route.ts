import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const verbose = searchParams.get('verbose') === 'true';
    const data: Record<string, unknown> = {
      status: 'ok',
      uptimeSeconds: Math.floor(process.uptime()),
      time: new Date().toISOString()
    };

    if (verbose) {
      data.runtime = { node: process.version, env: process.env.NODE_ENV || 'development' };
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: 'Health check failed' }, { status: 500 });
  }
}
