const parseBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';

export const ENV = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || '',
  USE_MOCK: parseBoolean(import.meta.env.VITE_USE_MOCK) || parseBoolean(import.meta.env.VITE_DEMO_MODE),
  DEMO_MODE: parseBoolean(import.meta.env.VITE_DEMO_MODE),
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
};
