import { NextResponse } from 'next/server';
import { komunitasAyahData } from '@/lib/data/komunitas-ayah';

export async function GET() {
  return NextResponse.json(komunitasAyahData);
}
