import { NextResponse } from 'next/server';
import { schoolProgramsData } from '@/lib/data/school-programs';

export async function GET() {
  return NextResponse.json(schoolProgramsData);
}
