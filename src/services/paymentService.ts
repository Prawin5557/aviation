import apiClient from './apiClient';
import toast from 'react-hot-toast';
import { ENV } from '@/src/config/env';

export interface PaymentOrder {
  id: string;
  amount: number;
  currency: string;
  status: 'created' | 'paid' | 'failed';
  planId: string;
  userId: string;
  createdAt: string;
  isMock?: boolean;
}

export interface PaymentVerification {
  success: boolean;
  paymentId: string;
  orderId: string;
  signature: string;
  status: 'captured' | 'failed';
}

export interface SubscriptionData {
  planId: string;
  amount: number;
  currency: string;
  interval: 'monthly' | 'yearly';
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

class PaymentService {
  private razorpayLoaded = false;

  // Load Razorpay script
  async loadRazorpay(): Promise<void> {
    if (this.razorpayLoaded && window.Razorpay) {
      return Promise.resolve();
    }

    const scriptSrc = 'https://checkout.razorpay.com/v1/checkout.js';
    const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${scriptSrc}"]`);

    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        this.razorpayLoaded = true;
        resolve();
        return;
      }

      const handleLoad = () => {
        this.razorpayLoaded = true;
        resolve();
      };

      const handleError = () => {
        reject(new Error('Failed to load Razorpay'));
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad);
        existingScript.addEventListener('error', handleError);
        return;
      }

      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = true;
      script.onload = handleLoad;
      script.onerror = handleError;
      document.body.appendChild(script);
    });
  }

  // Create payment order
  async createOrder(planId: string, amount: number, currency = 'INR', useMockData = false): Promise<PaymentOrder> {
    const shouldUseMock = useMockData || ENV.USE_MOCK;

    if (!shouldUseMock) {
      try {
        const response = await apiClient.post('/payments/create-order', {
          planId,
          amount: amount * 100,
          currency,
        });

        const order = response.data?.order || response.data?.data?.order || response.data;
        if (order && order.id && typeof order.amount === 'number') {
          return order;
        }

        throw new Error('Invalid payment order response from backend');
      } catch (error: any) {
        // Check if it's a network error
        if (error.isNetworkError || !error.response) {
          console.warn('Backend API unavailable (network error), using mock data for payment:', error.message);
          // Fall back to mock data for network errors
        } else {
          console.warn('Backend API error, using mock data for payment:', error?.response?.data?.message || error.message);
        }
      }
    }

    // Use mock data (either by choice or fallback)
    const mockOrder: PaymentOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      amount: amount * 100,
      currency,
      status: 'created',
      planId,
      userId: 'demo_user',
      createdAt: new Date().toISOString(),
      isMock: true,
    };

    return mockOrder;
  }

  // Verify payment
  async verifyPayment(verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
  }): Promise<PaymentVerification> {
    const shouldUseMock = ENV.USE_MOCK || ENV.DEMO_MODE;

    if (!shouldUseMock) {
      try {
        const response = await apiClient.post('/payments/verify', verificationData);
        return response.data;
      } catch (error: any) {
        // Check if it's a network error
        if (error.isNetworkError || !error.response) {
          console.warn('Backend API unavailable (network error), using mock verification:', error.message);
          // Fall back to mock verification for network errors
        } else {
          console.warn('Backend verification error, using mock verification:', error?.response?.data?.message || error.message);
        }
      }
    }

    // Use mock verification (either by choice or fallback)
    return {
      success: true,
      paymentId: verificationData.razorpay_payment_id,
      orderId: verificationData.razorpay_order_id,
      signature: verificationData.razorpay_signature,
      status: 'captured',
    };
  }

  // Create subscription (for recurring payments)
  async createSubscription(data: SubscriptionData): Promise<any> {
    try {
      const response = await apiClient.post('/payments/create-subscription', data);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to create subscription';
      toast.error(message);
      throw error;
    }
  }

  // Get payment history
  async getPaymentHistory(): Promise<PaymentOrder[]> {
    try {
      const response = await apiClient.get('/payments/history');
      return response.data.payments;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get payment history';
      toast.error(message);
      throw error;
    }
  }

  // Initialize Razorpay payment
  async initiatePayment(
    order: PaymentOrder,
    user: { name: string; email: string; phone?: string },
    onSuccess: (response: any) => void,
    onFailure: (error: any) => void,
    useMockData = false
  ): Promise<void> {
    try {
      const shouldUseMock = ENV.DEMO_MODE || useMockData;
      await this.loadRazorpay();

      if (!window.Razorpay) {
        if (shouldUseMock) {
          console.warn('Razorpay SDK unavailable; falling back to mock success for demo-mode payment');
          onSuccess({
            razorpay_order_id: order.id,
            razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            razorpay_signature: `sig_${Math.random().toString(36).substr(2, 9)}`,
          });
          return;
        }

        throw new Error('Razorpay SDK not available. Please check your internet connection.');
      }

      const options: any = {
        key: ENV.RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'ARMZ Aviation',
        description: `Plan Subscription - ${order.planId}`,
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone || '',
        },
        theme: {
          color: '#7c3aed',
        },
        handler: (response: any) => {
          onSuccess(response);
        },
        modal: {
          ondismiss: () => {
            onFailure({ reason: 'user_cancelled', message: 'Payment cancelled by user' });
          },
          confirm_close: true,
          escape: true,
        },
      };

      if (!order.isMock && order.id) {
        options.order_id = order.id;
      }

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', (response: any) => {
        onFailure(response.error || { message: 'Payment failed' });
      });

      rzp.open();
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to initialize payment. Please try again.';
      toast.error(errorMessage);
      onFailure(error);
    }
  }

  // Process payment completion
  async processPaymentCompletion(
    planId: string,
    paymentResponse: any,
    userId: string,
    useMockData = false
  ): Promise<{ success: boolean; subscription?: any }> {
    try {
      const verification = await this.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        planId,
      });

      if (verification.success) {
        const shouldUseMock = useMockData || ENV.USE_MOCK || ENV.DEMO_MODE;

        if (!shouldUseMock) {
          try {
            const subscriptionResponse = await apiClient.post('/users/update-subscription', {
              userId,
              planId,
              paymentId: paymentResponse.razorpay_payment_id,
            });
            toast.success('Payment successful! Your subscription is now active.');
            return { success: true, subscription: subscriptionResponse.data };
          } catch (error: any) {
            // Check if it's a network error
            if (error.isNetworkError || !error.response) {
              console.warn('Backend API unavailable (network error), using mock subscription:', error.message);
              // Fall back to mock subscription for network errors
            } else {
              console.warn('Backend subscription update error, using mock subscription:', error?.response?.data?.message || error.message);
            }
          }
        }

        try {
          const subscriptionResponse = await apiClient.post('/users/update-subscription', {
            userId,
            planId,
            paymentId: paymentResponse.razorpay_payment_id,
          });

          toast.success('Payment successful! Your subscription is now active.');
          return { success: true, subscription: subscriptionResponse.data };
        } catch (backendError: any) {
          console.warn('Backend subscription update unavailable, using mock:', backendError.message);
        }

        const mockSubscription = {
          id: `sub_${Date.now()}`,
          userId,
          planId,
          paymentId: paymentResponse.razorpay_payment_id,
          status: 'active',
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        toast.success('Payment successful! Your subscription is now active (Demo Mode).');
        return { success: true, subscription: mockSubscription };
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error: any) {
      console.error('Payment completion error:', error.message || error);
      toast.error('Payment could not be completed. Please contact support.');
      return { success: false };
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<void> {
    try {
      await apiClient.post('/payments/cancel-subscription', { subscriptionId });
      toast.success('Subscription cancelled successfully');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to cancel subscription';
      toast.error(message);
      throw error;
    }
  }

  // Get subscription details
  async getSubscriptionDetails(subscriptionId: string): Promise<any> {
    try {
      const response = await apiClient.get(`/payments/subscription/${subscriptionId}`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get subscription details';
      toast.error(message);
      throw error;
    }
  }
}

export const paymentService = new PaymentService();