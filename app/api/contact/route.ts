import { NextResponse } from 'next/server';
import { contactData } from '@/lib/data/contact';

export async function GET() {
  return NextResponse.json(contactData);
}
