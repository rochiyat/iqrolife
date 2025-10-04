import { NextResponse } from 'next/server';
import { misiData } from '@/lib/data/profile';

export async function GET() {
  return NextResponse.json(misiData);
}
