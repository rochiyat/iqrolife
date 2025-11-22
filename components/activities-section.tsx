'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { SkeletonActivities } from '@/components/ui/skeleton-loading';

export default function ActivitiesSection() {
  const [activitiesData, setActivitiesData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        // API endpoint removed - school folder deleted
        setActivitiesData(null);
      } catch (error) {
        console.error('Error fetching activities data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesData();
  }, []);

  if (loading) {
    return <SkeletonActivities />;
  }

  if (!activitiesData) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Error loading activities data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-white via-[#4caade]/5 to-[#f2cd5b]/5">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent mb-4">
            {activitiesData.title}
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            {activitiesData.description}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {activitiesData.items?.map((activity: any, index: number) => (
            <Card
              key={index}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-square relative">
                <Image
                  src={activity.image || '/placeholder.svg'}
                  alt={activity.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{activity.title}</h3>
                <p className="text-gray-600 text-sm">{activity.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            asChild
            className="bg-[#4caade] hover:bg-[#3a8fc7] text-white shadow-lg"
          >
            <a
              href={activitiesData.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Follow us on Instagram
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
