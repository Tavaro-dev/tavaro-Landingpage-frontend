import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { submitEnquiryAction as SubmitEnquiryActionType } from '../../app/actions/enquiry';

describe('Enquiry Service', () => {
  let submitEnquiryAction: typeof SubmitEnquiryActionType;

  beforeEach(async () => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('should return a demo success response in development mode', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    submitEnquiryAction = action;

    const result = await submitEnquiryAction({
      type: 'contact',
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
        interest: 'Booking a Stay',
        message: 'Hello'
      }
    });

    expect(result.success).toBe(true);
    expect(result.isDemo).toBe(true);
    expect(result.message).toContain('DEMO');
  });

  it('should return an unavailable error in production mode', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    submitEnquiryAction = action;

    const result = await submitEnquiryAction({
      type: 'contact',
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        phone: '1234567890',
        interest: 'Booking a Stay',
        message: 'Hello'
      }
    });

    expect(result.success).toBe(false);
    expect(result.isDemo).toBe(false);
    expect(result.message).toContain('currently unavailable in production');
  });

  it('should return validation errors for malformed input and strictly reject unknowns', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    submitEnquiryAction = action;
    const { enquiryService } = await import('../../lib/enquiry/service');
    
    const spy = vi.spyOn(enquiryService, 'submitEnquiry');

    try {
      // 1. Missing required field / malformed
      let result = await submitEnquiryAction({
        type: 'contact',
        data: {
          name: '', // Invalid: empty
          email: 'not-an-email', // Invalid email
          phone: '1234567890',
          interest: 'Booking a Stay',
        }
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();

      // 2. Extra unknown key (strict validation)
      result = await submitEnquiryAction({
        type: 'contact',
        data: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          phone: '1234567890',
          interest: 'Booking a Stay',
          message: 'Hello',
          extraUnknownField: true, // Should cause failure
        }
      });

      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();

      expect(spy).not.toHaveBeenCalled();
    } finally {
      spy.mockRestore();
    }
  });

  it('should handle all valid enquiry types', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    submitEnquiryAction = action;
    const { enquiryService } = await import('../../lib/enquiry/service');

    const spy = vi.spyOn(enquiryService, 'submitEnquiry');

    try {
      const validDining = {
        type: 'dining',
        data: {
          planningType: 'Private Dining',
          requestType: 'Event Menu',
          name: 'Jane Doe',
          contact: '1234567890',
          eventDate: '2027-10-10',
          guestCount: '10',
          occasion: 'Birthday',
          diningStyle: 'Plated',
          gatheringDescription: 'Looking forward to it'
        }
      };
      
      const result = await submitEnquiryAction(validDining);
      expect(result.success).toBe(true);
      expect(result.isDemo).toBe(true);
      
      expect(spy).toHaveBeenCalledOnce();
      expect(spy).toHaveBeenCalledWith(validDining);
    } finally {
      spy.mockRestore();
    }
  });
});
