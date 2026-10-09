import { describe, it, expect, vi, afterEach } from 'vitest';
import { paymentService } from '../../lib/payment/service';

describe('Payment Service', () => {
  it('should process payment successfully', async () => {
    const result = await paymentService.processPayment({ quoteId: 'quote-123' });
    expect(result.success).toBe(true);
    expect(result.paymentReference).toBeDefined();
    expect(result.error).toBeUndefined();
  });

  it('should handle forced failure deterministically', async () => {
    const result = await paymentService.processPayment({ quoteId: 'quote-123' }, true);
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('PAYMENT_FAILED');
    expect(result.error).toBe('Your bank declined the transaction. Please try again.');
  });
});

describe('Transaction Server Actions (Production restrictions)', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('processPaymentAction should succeed in development (demo mode)', async () => {
    vi.stubEnv('NODE_ENV', 'development');
    const action = await import('../../app/actions/transaction');
    const result = await action.processPaymentAction({ quoteId: 'quote-123' });
    expect(result.success).toBe(true);
  });

  it('processPaymentAction should fail safely in production', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    const action = await import('../../app/actions/transaction');
    const result = await action.processPaymentAction({ quoteId: 'quote-123' });
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('UNAVAILABLE');
    expect(result.error).toContain('not currently enabled');
  });
});
