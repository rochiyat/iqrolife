import { NextResponse } from 'next/server';
import { schoolVisionMissionData } from '@/lib/data/school-vision-mission';

export async function GET() {
  return NextResponse.json(schoolVisionMissionData);
}
