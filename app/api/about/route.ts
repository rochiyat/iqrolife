import { NextResponse } from 'next/server';
import { aboutData } from '@/lib/data/about';

export async function GET() {
  return NextResponse.json(aboutData);
}
