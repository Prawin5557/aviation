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

  async createOrder(planId: string, amount: number, currency = 'INR'): Promise<PaymentOrder> {
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
  }

  async verifyPayment(verificationData: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    planId: string;
  }): Promise<PaymentVerification> {
    const response = await apiClient.post('/payments/verify', verificationData);
    return response.data;
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
    onFailure: (error: any) => void
  ): Promise<void> {
    try {
      await this.loadRazorpay();

      if (!window.Razorpay) {
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

      if (order.id) {
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
    userId: string
  ): Promise<{ success: boolean; subscription?: any }> {
    try {
      const verification = await this.verifyPayment({
        razorpay_order_id: paymentResponse.razorpay_order_id,
        razorpay_payment_id: paymentResponse.razorpay_payment_id,
        razorpay_signature: paymentResponse.razorpay_signature,
        planId,
      });

      if (verification.success) {
        const subscriptionResponse = await apiClient.post('/users/update-subscription', {
          userId,
          planId,
          paymentId: paymentResponse.razorpay_payment_id,
        });

        toast.success('Payment successful! Your subscription is now active.');
        return { success: true, subscription: subscriptionResponse.data };
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