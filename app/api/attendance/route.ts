import { NextResponse } from 'next/server';
import { getAttendance, checkInEmployee } from '@/lib/db';

export async function GET() {
  try {
    const records = await getAttendance();
    return NextResponse.json(records);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch attendance records' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { employeeId, shift, notes } = await req.json();
    const newRecord = await checkInEmployee(Number(employeeId), shift || 'Ca sáng (8h-17h)', notes);
    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to record attendance' }, { status: 500 });
  }
}
