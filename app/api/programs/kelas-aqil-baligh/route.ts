import { NextResponse } from 'next/server';
import { kelasAqilBalighData } from '@/lib/data/kelas-aqil-baligh';

export async function GET() {
  return NextResponse.json(kelasAqilBalighData);
}
