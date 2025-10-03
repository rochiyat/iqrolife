import { NextResponse } from 'next/server';
import { schoolHeroData } from '@/lib/data/school-hero';

export async function GET() {
  return NextResponse.json(schoolHeroData);
}
