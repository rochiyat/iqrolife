import { NextResponse } from 'next/server';
import { programsData } from '@/lib/data/programs';

export async function GET() {
  return NextResponse.json(programsData);
}
