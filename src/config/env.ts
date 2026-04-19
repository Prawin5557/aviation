const parseBoolean = (value: string | undefined): boolean => value?.toLowerCase() === 'true';

const apiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
const appName = import.meta.env.VITE_APP_NAME || 'ARMZ Aviation';
const isProd = import.meta.env.PROD;
const demoMode = parseBoolean(import.meta.env.VITE_DEMO_MODE);
const useMock = parseBoolean(import.meta.env.VITE_USE_MOCK);
const allowFrontendOnlyInProd = parseBoolean(import.meta.env.VITE_ALLOW_FRONTEND_ONLY_IN_PROD);

const frontendOnlyRequested = demoMode || useMock || !apiUrl;
const frontendOnlyAllowed = !isProd || allowFrontendOnlyInProd;
const frontendOnly = import.meta.env.DEV || (frontendOnlyRequested && frontendOnlyAllowed);

if (!apiUrl && isProd && !allowFrontendOnlyInProd) {
  throw new Error('Missing required environment variable: VITE_API_URL');
}

export const ENV = {
  API_BASE_URL: apiUrl,
  APP_NAME: appName,
  IS_DEVELOPMENT: import.meta.env.DEV,
  ENABLE_ANALYTICS: parseBoolean(import.meta.env.VITE_ENABLE_ANALYTICS),
  USE_MOCK: useMock,
  DEMO_MODE: demoMode,
  ALLOW_FRONTEND_ONLY_IN_PROD: allowFrontendOnlyInProd,
  STRICT_PRODUCTION: isProd && !allowFrontendOnlyInProd,
  RAZORPAY_KEY_ID: import.meta.env.VITE_RAZORPAY_KEY_ID || '',
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
  PUBLIC_GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || '',
  AI_BACKEND_PATH: import.meta.env.VITE_AI_BACKEND_PATH || '/ai/generate',
  FRONTEND_ONLY: frontendOnly,
};
