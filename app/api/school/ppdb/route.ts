import { NextResponse } from 'next/server';
import { schoolPPDBData } from '@/lib/data/school-ppdb';

export async function GET() {
  return NextResponse.json(schoolPPDBData);
}
