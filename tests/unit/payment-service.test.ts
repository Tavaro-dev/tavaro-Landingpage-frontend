import { describe, it, expect } from 'vitest';
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
