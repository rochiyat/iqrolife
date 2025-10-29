import { NextResponse } from 'next/server';
import { mentoringIbuData } from '@/lib/data/mentoring-ibu';

export async function GET() {
  return NextResponse.json(mentoringIbuData);
}
