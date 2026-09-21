import { NextResponse } from 'next/server';
import { getMaintenanceRequests, addMaintenanceRequest, updateMaintenanceStatus } from '@/lib/db';

export async function GET() {
  try {
    const requests = await getMaintenanceRequests();
    return NextResponse.json(requests);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch maintenance requests' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const newReq = await addMaintenanceRequest(body);
    return NextResponse.json(newReq, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create maintenance request' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { requestId, status, ...rest } = await req.json();
    const updated = await updateMaintenanceStatus(Number(requestId), status, rest);
    if (!updated) {
      return NextResponse.json({ error: 'Request not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update maintenance request' }, { status: 500 });
  }
}
