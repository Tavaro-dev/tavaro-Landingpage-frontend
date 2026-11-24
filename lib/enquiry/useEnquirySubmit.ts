"use client";

import { useState } from "react";
import { submitEnquiryAction } from "@/app/actions/enquiry";
import { CONTACT } from "@/lib/env";
import { currentSection } from "@/lib/subdomains";
import type { EnquiryPayload } from "./types";

/**
 * Shared submit state for every enquiry form: submitting flag, error text,
 * success + demo flags. Catches thrown errors (e.g. network) so a form can
 * never get stuck on "Submitting…".
 */
export function useEnquirySubmit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDemo, setIsDemo] = useState(false);

  async function submit(payload: EnquiryPayload): Promise<boolean> {
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await submitEnquiryAction(payload, currentSection());
      if (result.success) {
        setIsDemo(Boolean(result.isDemo));
        setSubmitted(true);
        return true;
      }
      setError(result.message);
    } catch {
      setError(`We couldn't send this right now. Please try again, or reach us on ${CONTACT.phone} / ${CONTACT.email}.`);
    } finally {
      setIsSubmitting(false);
    }
    return false;
  }

  function reset() {
    setSubmitted(false);
    setError(null);
    setIsDemo(false);
  }

  return { submit, reset, isSubmitting, submitted, error, isDemo };
}
