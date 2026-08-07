import { VirtualTryOnSection } from "@/components/ai-studio/virtual-try-on-section";
import { PreWeddingShootSection } from "@/components/ai-studio/pre-wedding-shoot-section";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageContainer } from "@/components/layout/page-container";

export default function AIStudioPage() {
  return (
    <PageContainer>
      <ModuleHeader
        moduleLabel="Module 03"
        badgeTone="emerald"
        title="🎨 AI Visual Studio"
        description="Try on couture virtually under real event lighting, then generate a full destination pre-wedding photoshoot — no travel required."
      />
      <VirtualTryOnSection />
      <PreWeddingShootSection />
    </PageContainer>
  );
}
