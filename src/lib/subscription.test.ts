import { describe, expect, it } from 'vitest';
import { getSubscriptionRouteForRole, hasActiveSubscription } from './subscription';

describe('subscription helpers', () => {
  it('returns true for active paid plans', () => {
    expect(hasActiveSubscription({ subscription: 'premium' } as any)).toBe(true);
    expect(hasActiveSubscription({ subscription: ' ENTERPRISE ' } as any)).toBe(true);
  });

  it('returns false for missing or unknown plans', () => {
    expect(hasActiveSubscription(null as any)).toBe(false);
    expect(hasActiveSubscription({ subscription: 'free' } as any)).toBe(false);
    expect(hasActiveSubscription({} as any)).toBe(false);
  });

  it('returns role-based subscription routes', () => {
    expect(getSubscriptionRouteForRole('employer')).toBe('/employer/subscription');
    expect(getSubscriptionRouteForRole('student')).toBe('/dashboard/subscriptions');
    expect(getSubscriptionRouteForRole(undefined)).toBe('/dashboard/subscriptions');
  });
});
