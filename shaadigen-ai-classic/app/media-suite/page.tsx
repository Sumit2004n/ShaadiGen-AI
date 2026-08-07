import { ModuleHeader } from "@/components/layout/module-header";
import { PageContainer } from "@/components/layout/page-container";
import { InvitationStudioSection } from "@/components/media-suite/invitation-studio-section";
import { LoveSongSection } from "@/components/media-suite/love-song-section";

export default function MediaSuitePage() {
  return (
    <PageContainer>
      <ModuleHeader
        moduleLabel="Module 04"
        badgeTone="amber"
        title="🎵 AI Media Suite"
        description="Compose a custom love song from your story and design a living invitation card — shareable in one tap."
      />
      <LoveSongSection />
      <InvitationStudioSection />
    </PageContainer>
  );
}
