import { NextResponse } from 'next/server';
import { visiData } from '@/lib/data/profile';

export async function GET() {
  return NextResponse.json(visiData);
}
