import { NextResponse } from 'next/server';
import { familyTalentDiscoveryData } from '@/lib/data/family-talent-discovery';

export async function GET() {
  return NextResponse.json(familyTalentDiscoveryData);
}
