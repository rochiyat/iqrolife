import { NextResponse } from 'next/server';
import { mentoringAyahData } from '@/lib/data/mentoring-ayah';

export async function GET() {
  return NextResponse.json(mentoringAyahData);
}
