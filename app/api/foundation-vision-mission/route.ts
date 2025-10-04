import { NextResponse } from 'next/server';
import { foundationVisionMissionData } from '@/lib/data/foundation-vision-mission';

export async function GET() {
  return NextResponse.json(foundationVisionMissionData);
}
