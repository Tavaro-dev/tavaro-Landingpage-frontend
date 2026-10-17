import { pageMetadata } from "@/lib/metadata";
import { CreateExperienceView } from "@/features/resorts/components/CreateExperienceView";

export const metadata = pageMetadata({
  title: "Create Your Experience — Tavaro Resorts | Tavaro",
  description:
    "From moments of stillness to meaningful celebrations, arrange a special on-request experience with the team at Tavaro Resorts, Kokapet.",
  path: "/resorts/things-to-do/create",
});

export default function CreateExperiencePage() {
  return <CreateExperienceView />;
}
