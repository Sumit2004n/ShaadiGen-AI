import { WelcomeCard } from "@/components/guest-hub/welcome-card";
import { EventScheduleSection } from "@/components/guest-hub/event-schedule-section";
import { RsvpSection } from "@/components/guest-hub/rsvp-section";
import { ModuleHeader } from "@/components/layout/module-header";
import { PageContainer } from "@/components/layout/page-container";

export default function GuestHubPage() {
  return (
    <PageContainer maxWidth="5xl">
      <ModuleHeader
        moduleLabel="Module 05 · Guest Portal"
        badgeTone="emerald"
        title="💒 Join My Wedding"
        centered
      />
      <WelcomeCard />
      <EventScheduleSection />
      <RsvpSection />
    </PageContainer>
  );
}
