import { NextResponse } from 'next/server';
import { schoolMainData } from '@/lib/data/school-main';

export async function GET() {
  return NextResponse.json(schoolMainData);
}
