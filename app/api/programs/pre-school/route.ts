import { NextResponse } from 'next/server';
import { preSchoolData } from '@/lib/data/pre-school';

export async function GET() {
  return NextResponse.json(preSchoolData);
}
