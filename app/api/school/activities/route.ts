import { NextResponse } from 'next/server';
import { schoolActivitiesData } from '@/lib/data/school-activities';

export async function GET() {
  return NextResponse.json(schoolActivitiesData);
}
