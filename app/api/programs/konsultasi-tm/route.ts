import { NextResponse } from 'next/server';
import { konsultasiTMData } from '@/lib/data/konsultasi-tm';

export async function GET() {
  return NextResponse.json(konsultasiTMData);
}
