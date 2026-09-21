import { NextResponse } from 'next/server';
import { getUtilityReadings, addUtilityReading } from '@/lib/db';

export async function GET() {
  try {
    const readings = await getUtilityReadings();
    return NextResponse.json(readings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch utility readings' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReading = await addUtilityReading(body);
    return NextResponse.json(newReading, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record utility reading' }, { status: 500 });
  }
}
