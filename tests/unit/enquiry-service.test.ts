import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { submitEnquiryAction as SubmitEnquiryActionType } from '../../app/actions/enquiry';
import { LEKVYA } from '../../lib/env';

// Stand-in keys: the real ones live in .env, which tests never read.
const KEYS = { resort: 'pk_test_resort', experiences: 'pk_test_experiences' };

describe('Enquiry Service', () => {
  let submitEnquiryAction: typeof SubmitEnquiryActionType;
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.resetModules();
    vi.stubEnv('LEKVYA_KEY_RESORT', KEYS.resort);
    vi.stubEnv('LEKVYA_KEY_EXPERIENCES', KEYS.experiences);
    fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal('fetch', fetchMock);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it('should send contact enquiries to Lekvya', async () => {
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
    expect(result.isDemo).toBe(false);
    expect(fetchMock).toHaveBeenCalledOnce();

    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe(LEKVYA.sendFormUrl);
    expect(init.method).toBe('POST');
    expect(JSON.parse(init.body)).toMatchObject({
      publicKey: KEYS.resort,
      formName: 'Contact',
      enquiryType: 'contact',
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '1234567890',
      interest: 'Booking a Stay',
      message: 'Hello',
    });
  });

  it('sends each brand site to its own inbox, and everything else to the resort one', async () => {
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    const data = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890', interest: 'Booking a Stay' };
    const keyFor = async (site?: string) => {
      fetchMock.mockClear();
      await action({ type: 'contact', data }, site);
      return JSON.parse(fetchMock.mock.calls[0][1].body).publicKey;
    };

    expect(await keyFor('resort')).toBe(KEYS.resort);
    expect(await keyFor('experiences')).toBe(KEYS.experiences);
    expect(await keyFor('mare')).toBe(KEYS.resort); // no key of its own yet
    expect(await keyFor(undefined)).toBe(KEYS.resort); // group pages
    expect(await keyFor('toString')).toBe(KEYS.resort); // not a site
  });

  it('does not send, and says so, when no key is set', async () => {
    vi.stubEnv('LEKVYA_KEY_RESORT', '');
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    const data = { name: 'Jane Doe', email: 'jane@example.com', phone: '1234567890', interest: 'Booking a Stay' };

    const result = await action({ type: 'contact', data });
    expect(result.success).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('should return a friendly error when Lekvya responds with a failure', async () => {
    fetchMock.mockResolvedValueOnce({ ok: false, status: 500 });

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
    expect(result.message).toContain('celebrate@tavaro.in');
  });

  it('should return validation errors for malformed input and strictly reject unknowns', async () => {
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
    const { submitEnquiryAction: action } = await import('../../app/actions/enquiry');
    submitEnquiryAction = action;

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
    expect(result.isDemo).toBe(false);

    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body).toMatchObject({
      formName: 'Dining Enquiry',
      enquiryType: 'dining',
      name: 'Jane Doe',
      contact: '1234567890',
      phone: '1234567890',
    });
  });
});
