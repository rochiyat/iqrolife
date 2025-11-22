'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { SkeletonVideoGallery } from '@/components/ui/skeleton-loading';

export default function VideoGallerySection() {
  const [videoGalleryData, setVideoGalleryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVideoGalleryData = async () => {
      try {
        // API endpoint removed - school folder deleted
        setVideoGalleryData(null);
      } catch (error) {
        console.error('Error fetching video gallery data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVideoGalleryData();
  }, []);

  if (loading) {
    return <SkeletonVideoGallery />;
  }

  if (!videoGalleryData) {
    return (
      <section className="py-16 bg-blue-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-4">
              Error loading video gallery data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-[#4caade] to-[#3a8fc7] text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-white">
            {videoGalleryData.title}
          </h2>
          <p className="text-xl text-white/90 mb-8">
            {videoGalleryData.subtitle}
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#f2cd5b] hover:bg-[#e5bc45] text-gray-800 font-bold shadow-lg"
          >
            <a
              href={videoGalleryData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Hubungi Kami
            </a>
          </Button>
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold mb-8">
            Gallery Video Iqrolife Community
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videoGalleryData.videos?.map((video: any) => (
            <Card
              key={video.id}
              className="bg-white/15 backdrop-blur-sm border-white/30 hover:bg-white/20 transition-all duration-300"
            >
              <CardContent className="p-4">
                <div className="aspect-video bg-[#f2cd5b]/20 rounded-lg flex items-center justify-center mb-4">
                  <svg
                    className="w-16 h-16 text-[#f2cd5b]"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-lg text-white">
                  {video.title}
                </h4>
                <p className="text-white/80 text-sm">{video.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="flex justify-center space-x-6">
            <a
              href={videoGalleryData.socialLinks?.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-pink-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987c6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297L3.182 17.635l1.935-1.935c-.807-.875-1.297-2.026-1.297-3.323s.49-2.448 1.297-3.323L3.182 7.119l1.944-1.944c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297l1.935-1.935l1.935 1.935c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323l1.935 1.935l-1.935 1.935c-.875.807-2.026 1.297-3.323 1.297z" />
              </svg>
            </a>
            <a
              href={videoGalleryData.socialLinks?.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-red-300"
            >
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
