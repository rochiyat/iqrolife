import { NextResponse } from 'next/server';
import { schoolData } from '@/lib/data/school';

export async function GET() {
  return NextResponse.json(schoolData);
}
