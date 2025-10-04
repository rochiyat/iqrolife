import Header from '@/components/header';
import HeroSection from '@/components/hero-section';
import ProfileSection from '@/components/profile-section';
import VisionMissionSection from '@/components/vision-mission-section';
import ProgramsSection from '@/components/programs-section';
import ActivitiesSection from '@/components/activities-section';
import GallerySection from '@/components/gallery-section';
import VideoGallerySection from '@/components/video-gallery-section';
import TestimonialsSection from '@/components/testimonials-section';
import ContactSection from '@/components/contact-section';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProfileSection />
        <VisionMissionSection />
        <ProgramsSection />
        <ActivitiesSection />
        <GallerySection />
        <VideoGallerySection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
