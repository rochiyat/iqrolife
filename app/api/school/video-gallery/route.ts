import { NextResponse } from 'next/server';
import { schoolVideoGalleryData } from '@/lib/data/school-video-gallery';

export async function GET() {
  return NextResponse.json(schoolVideoGalleryData);
}
