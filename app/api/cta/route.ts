import { NextResponse } from 'next/server';
import { ctaData } from '@/lib/data/cta';

export async function GET() {
  return NextResponse.json(ctaData);
}
