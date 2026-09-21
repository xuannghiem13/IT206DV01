import { NextResponse } from 'next/server';
import { getTenants, addTenant } from '@/lib/db';

export async function GET() {
  try {
    const tenants = await getTenants();
    return NextResponse.json(tenants);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tenants' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newTenant = await addTenant(body);
    return NextResponse.json(newTenant, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add tenant' }, { status: 500 });
  }
}
