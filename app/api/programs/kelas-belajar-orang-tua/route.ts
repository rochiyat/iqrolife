import { NextResponse } from 'next/server';
import { kelasBelajarOrangTuaData } from '@/lib/data/kelas-belajar-orang-tua';

export async function GET() {
  return NextResponse.json(kelasBelajarOrangTuaData);
}
