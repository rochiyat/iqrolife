'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function ProfileSection() {
  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('/api/school/profile');
        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loading...
            </h2>
          </div>
        </div>
      </section>
    );
  }

  if (!profileData) {
    return (
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Error loading profile data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            {profileData.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {profileData.description}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <Image
              src={
                profileData.image ||
                '/school-principal-or-teacher-with-certificate.jpg'
              }
              alt={profileData.imageAlt || 'Profil Kepala Sekolah'}
              width={500}
              height={400}
              className="rounded-2xl"
            />
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visi</h3>
              <p className="text-gray-600 leading-relaxed">
                {profileData.visi}
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Misi</h3>
              <ul className="space-y-3 text-gray-600">
                {profileData.misi?.map((item: string, index: number) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                        index === 0
                          ? 'bg-orange-600'
                          : index === 1
                          ? 'bg-blue-600'
                          : index === 2
                          ? 'bg-green-600'
                          : 'bg-purple-600'
                      }`}
                    ></div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
