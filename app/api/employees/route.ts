import { NextResponse } from 'next/server';
import { getEmployees, addEmployee } from '@/lib/db';

export async function GET() {
  try {
    const employees = await getEmployees();
    return NextResponse.json(employees);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch employees' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newEmp = await addEmployee(body);
    return NextResponse.json(newEmp, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add employee' }, { status: 500 });
  }
}
