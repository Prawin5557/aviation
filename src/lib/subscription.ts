import { User } from '@/src/types';

const ACTIVE_SUBSCRIPTIONS = new Set([
  'prime',
  'premium',
  'placement',
  'placements',
  'professional',
  'elite',
  'pro',
  'enterprise',
  'recruiter_starter',
  'recruiter_growth',
  'recruiter_enterprise',
]);

export const hasActiveSubscription = (user?: User | null): boolean => {
  if (!user) return false;
  const value = String(user.subscription || '').trim().toLowerCase();
  return ACTIVE_SUBSCRIPTIONS.has(value);
};

export const getSubscriptionRouteForRole = (role?: string): string => {
  if (role === 'employer') return '/employer/subscription';
  return '/dashboard/subscriptions';
};
