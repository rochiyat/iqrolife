import { NextResponse } from 'next/server';
import { kelasEksplorasiData } from '@/lib/data/kelas-eksplorasi';

export async function GET() {
  return NextResponse.json(kelasEksplorasiData);
}
