import { DashboardHero } from "@/components/dashboard/dashboard-hero";
import { FeatureGrid } from "@/components/dashboard/feature-grid";
import { PageContainer } from "@/components/layout/page-container";

export default function DashboardPage() {
  return (
    <PageContainer>
      <DashboardHero />
      <FeatureGrid />
    </PageContainer>
  );
}
