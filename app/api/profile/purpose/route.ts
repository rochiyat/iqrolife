import { NextResponse } from 'next/server';
import { purposeData } from '@/lib/data/profile';

export async function GET() {
  return NextResponse.json(purposeData);
}
