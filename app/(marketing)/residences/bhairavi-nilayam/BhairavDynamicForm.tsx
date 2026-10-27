"use client";

import dynamic from "next/dynamic";

const ResidenceInterestForm = dynamic(
  () => import("@/features/residences/components/ResidenceInterestForm"),
  { ssr: false }
);

export default function BhairavDynamicForm() {
  return <ResidenceInterestForm defaultResidence="Bhairavi Nilayam" />;
}
