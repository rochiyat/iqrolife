import { NextResponse } from 'next/server';
import { schoolProfileData } from '@/lib/data/school-profile';

export async function GET() {
  return NextResponse.json(schoolProfileData);
}
