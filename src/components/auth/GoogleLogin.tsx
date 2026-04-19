import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { authService } from '@/src/services/authService';

interface GoogleLoginProps {
  onSuccess: (user: any) => void;
  onError?: (error: any) => void;
  text?: string;
  className?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function GoogleLogin({
  onSuccess,
  onError,
  text = "Continue with Google",
  className = ""
}: GoogleLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const onSuccessRef = useRef(onSuccess);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onSuccessRef.current = onSuccess;
    onErrorRef.current = onError;
  }, [onSuccess, onError]);

  useEffect(() => {
    const scriptSrc = 'https://accounts.google.com/gsi/client';
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);

    const handleGoogleResponse = async (response: any) => {
      setIsLoading(true);
      try {
        const result = await authService.googleLogin(response.credential);
        onSuccessRef.current(result);
      } catch (error) {
        if (onErrorRef.current) onErrorRef.current(error);
      } finally {
        setIsLoading(false);
      }
    };

    const initializeGoogleSignIn = () => {
      if (!window.google?.accounts?.id) {
        return;
      }

      if (!googleClientId) {
        setIsGoogleLoaded(false);
        setInitError('Google Sign-In is not configured for this environment.');
        return;
      }

      setInitError(null);

      const accountsId = window.google.accounts.id as any;
      if (accountsId.__initialized) {
        setIsGoogleLoaded(true);
        return;
      }

      accountsId.initialize({
        client_id: googleClientId,
        callback: handleGoogleResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      accountsId.__initialized = true;
      setIsGoogleLoaded(true);
    };

    const loadGoogleScript = () => {
      if (window.google?.accounts?.id) {
        initializeGoogleSignIn();
        return;
      }

      if (existingScript) {
        existingScript.addEventListener('load', initializeGoogleSignIn);
        existingScript.addEventListener('error', () => {
          setInitError('Failed to load Google services.');
          if (onErrorRef.current) onErrorRef.current(new Error('Failed to load Google services'));
        });
        return;
      }

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogleSignIn;
      script.onerror = () => {
        setInitError('Failed to load Google services.');
        if (onErrorRef.current) onErrorRef.current(new Error('Failed to load Google services'));
      };
      document.head.appendChild(script);
    };

    loadGoogleScript();

    return () => {
      if (existingScript) {
        existingScript.removeEventListener('load', initializeGoogleSignIn);
      }
    };
  }, [googleClientId]);

  const handleGoogleSignIn = () => {
    if (!googleClientId) {
      return;
    }

    if (!isGoogleLoaded || !window.google) {
      if (onErrorRef.current) {
        onErrorRef.current(new Error('Google Identity Services not loaded'));
      }
      return;
    }

    setIsLoading(true);
    window.google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setIsLoading(false);
      }
    });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleGoogleSignIn}
      disabled={isLoading || !isGoogleLoaded || !googleClientId}
      aria-disabled={isLoading || !isGoogleLoaded || !googleClientId}
      title={initError || undefined}
      className={`w-full flex items-center justify-center px-4 py-3 border border-slate-300 rounded-xl bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <Loader2 className="h-5 w-5 animate-spin mr-3" />
      ) : (
        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
      )}
      <span className="text-slate-700 font-medium">
        {isLoading ? 'Signing in...' : text}
      </span>
    </motion.button>
  );
}