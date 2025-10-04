import { NextResponse } from 'next/server';
import { schoolFooterData } from '@/lib/data/school-footer';

export async function GET() {
  return NextResponse.json(schoolFooterData);
}
