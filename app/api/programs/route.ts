import { NextResponse } from 'next/server';
import { programsHomeData, programsHomeStats } from '@/lib/data/programs-home';

export async function GET() {
  return NextResponse.json({
    programs: programsHomeData,
    total: programsHomeStats.total,
    categories: programsHomeStats.categories,
  });
}
