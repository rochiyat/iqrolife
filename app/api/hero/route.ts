import { NextResponse } from 'next/server';
import { heroData } from '@/lib/data/hero';

export async function GET() {
  return NextResponse.json(heroData);
}
