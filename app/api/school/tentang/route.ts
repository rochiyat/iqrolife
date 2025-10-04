import { NextResponse } from 'next/server';
import { schoolTentangData } from '@/lib/data/school-tentang';

export async function GET() {
  return NextResponse.json(schoolTentangData);
}
