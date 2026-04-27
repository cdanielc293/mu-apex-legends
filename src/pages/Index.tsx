import { SiteLayout } from "@/components/site/SiteLayout";
import { Hero } from "@/components/home/Hero";
import { ClassesSection } from "@/components/home/ClassesSection";
import { NewsSection } from "@/components/home/NewsSection";
import { RankingsPreview } from "@/components/home/RankingsPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <SiteLayout>
      <Hero />
      <NewsSection />
      <RankingsPreview />
      <ClassesSection />
      <CTASection />
    </SiteLayout>
  );
};

export default Index;
