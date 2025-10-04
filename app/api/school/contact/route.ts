import { NextResponse } from 'next/server';
import { schoolContactData } from '@/lib/data/school-contact';

export async function GET() {
  return NextResponse.json(schoolContactData);
}
