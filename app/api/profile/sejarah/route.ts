import { NextResponse } from 'next/server';
import { sejarahData } from '@/lib/data/profile';

export async function GET() {
  return NextResponse.json(sejarahData);
}
