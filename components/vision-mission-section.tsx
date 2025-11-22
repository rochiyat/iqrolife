'use client';

import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AnimatedSection } from './animated-section';
import { useEffect, useState } from 'react';
import { SkeletonVisionMission } from '@/components/ui/skeleton-loading';

export default function VisionMissionSection() {
  const [visionMissionData, setVisionMissionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisionMissionData = async () => {
      try {
        // Only use foundation API - school API removed
        const response = await fetch('/api/foundation-vision-mission');
        const data = await response.json();
        setVisionMissionData(data);
      } catch (error) {
        console.error('Error fetching vision mission data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisionMissionData();
  }, []);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  if (loading) {
    return <SkeletonVisionMission />;
  }

  if (!visionMissionData) {
    return (
      <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Error loading vision mission data
            </h2>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="visi-misi"
      className="py-16 bg-gradient-to-br from-[#4caade]/20 to-[#f2cd5b]/10 overflow-hidden"
    >
      <div className="container mx-auto px-4">
        <AnimatedSection>
          <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-[#4caade] to-[#f2cd5b] bg-clip-text text-transparent">
            {visionMissionData.title}
          </h2>
        </AnimatedSection>

        <div className="max-w-6xl mx-auto space-y-8">
          {visionMissionData.purpose && (
            <AnimatedSection delay={0.1}>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                      className="w-16 h-16 bg-brand-warm-brown rounded-full flex items-center justify-center mx-auto mb-4"
                    >
                      <svg
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                    </motion.div>
                    <motion.h2
                      whileHover={{ scale: 1.05 }}
                      className="text-3xl font-bold bg-gradient-to-r from-brand-warm-brown to-brand-dark-brown bg-clip-text text-transparent mb-4"
                    >
                      Purpose
                    </motion.h2>
                  </div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-brand-gray text-lg leading-relaxed text-center italic"
                  >
                    "{visionMissionData.purpose}"
                  </motion.p>
                </CardContent>
              </Card>
            </AnimatedSection>
          )}

          <AnimatedSection delay={0.2}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-[#4caade] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <svg
                      className="w-8 h-8 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </motion.div>
                  <motion.h2
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold text-[#4caade] mb-6"
                  >
                    Misi
                  </motion.h2>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-brand-gray text-lg leading-relaxed text-center italic"
                >
                  "{visionMissionData.misi}"
                </motion.p>
              </CardContent>
            </Card>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-16 h-16 bg-[#f2cd5b] rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg"
                  >
                    <svg
                      className="w-8 h-8 text-gray-800"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </motion.div>
                  <motion.h2
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold text-[#4caade] mb-4"
                  >
                    Visi
                  </motion.h2>
                </div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-brand-gray text-lg leading-relaxed text-center italic"
                >
                  "{visionMissionData.visi}"
                </motion.p>
              </CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
