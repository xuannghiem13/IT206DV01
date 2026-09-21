import { NextResponse } from 'next/server';
import { getContracts, addContract } from '@/lib/db';

export async function GET() {
  try {
    const contracts = await getContracts();
    return NextResponse.json(contracts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contracts' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newContract = await addContract(body);
    return NextResponse.json(newContract, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add contract' }, { status: 500 });
  }
}
