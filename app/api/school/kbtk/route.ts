import { NextResponse } from 'next/server';
import { schoolKBTKData } from '@/lib/data/school-kbtk';

export async function GET() {
  return NextResponse.json(schoolKBTKData);
}
