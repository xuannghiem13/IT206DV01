import { NextResponse } from 'next/server';
import { getInvoices, payInvoice } from '@/lib/db';

export async function GET() {
  try {
    const invoices = await getInvoices();
    return NextResponse.json(invoices);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { invoiceId, amount, paymentMethod } = await req.json();
    const updated = await payInvoice(Number(invoiceId), Number(amount), paymentMethod || 'Chuyển khoản VietQR');
    if (!updated) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process payment' }, { status: 500 });
  }
}
