import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, Check, Zap, Shield, CreditCard, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { usePlanStore } from '@/src/store/planStore';
import { useAuthStore } from '@/src/store/authStore';
import { useLeadStore } from '@/src/store/leadStore';
import { paymentService } from '@/src/services/paymentService';
import { ENV } from '@/src/config/env';
import toast from 'react-hot-toast';

interface PaymentFlowProps {
  isOpen: boolean;
  onClose: () => void;
  planId?: string;
  planName?: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentFlow({ isOpen, onClose, planId, planName }: PaymentFlowProps) {
  const { user, login } = useAuthStore();
  const { plans } = usePlanStore();
  const { createLead } = useLeadStore();
  
  const [step, setStep] = useState<'confirmation' | 'details' | 'payment' | 'success'>('confirmation');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [demoModalProcessing, setDemoModalProcessing] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '4111 1111 1111 1111',
    cardName: user?.name || '',
    expiryMonth: '12',
    expiryYear: '2028',
    cvv: '123',
  });

  const plan = plans.find(p => p.id === planId);
  const planIdForPayment = planId || plan?.id || 'premium';
  const selectedPlanName = planName || plan?.name || 'Premium';
  const selectedPlanPrice = plan?.price || 9999;
  const selectedPlanFeatures = plan?.features || [];
  const normalizedPlanName = selectedPlanName.replace(/\s*plan$/i, '').trim();
  const displayPlanName = normalizedPlanName || selectedPlanName;

  useEffect(() => {
    if (isOpen) {
      setStep('confirmation');
      setIsProcessing(false);

      paymentService.loadRazorpay()
        .then(() => setRazorpayLoaded(true))
        .catch(() => {
          setRazorpayLoaded(false);
          toast.error('Failed to load payment system. Please refresh and try again.');
        });
    }
  }, [isOpen]);

  const handleDemoPaymentCompletion = async () => {
    try {
      setDemoModalProcessing(false);
      
      // Create mock response
      const mockResponse = {
        razorpay_order_id: `order_${Date.now()}`,
        razorpay_payment_id: `pay_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        razorpay_signature: `sig_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Process payment completion
      const result = await paymentService.processPaymentCompletion(
        planIdForPayment,
        mockResponse,
        user?.id || 'demo_user'
      );

      if (result.success) {
        // Create lead for payment conversion
        await createLead({
          name: user?.name || 'Demo User',
          email: user?.email || 'demo@example.com',
          phone: user?.phone || '+91-0000000000',
          interest: `Subscribed to ${displayPlanName} Plan`,
          source: 'course_enroll',
          message: `Payment successful for ${displayPlanName} plan - ₹${Math.round(selectedPlanPrice * 1.18)} - Payment ID: ${mockResponse.razorpay_payment_id}`,
        });

        // Update user subscription
        if (user) {
          login({
            ...user,
            subscription: planIdForPayment,
          });
        }
        setStep('success');

        setTimeout(() => {
          toast.success(`Welcome to ${displayPlanName}! Your subscription is now active.`, {
            duration: 5000,
            icon: '🎉',
          });
          onClose();
        }, 2500);
      } else {
        toast.error('Payment verification failed');
      }
    } catch (error) {
      console.error('Demo payment completion error:', error);
      toast.error('Payment verification failed');
    }
  };

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please login to proceed');
      return;
    }

    if (!razorpayLoaded) {
      toast.error('Payment system not loaded. Please refresh and try again.');
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment order
      await paymentService.loadRazorpay();
      const order = await paymentService.createOrder(planIdForPayment, Math.round(selectedPlanPrice * 1.18));

      // Show demo modal for demo/mock orders
      if (ENV.DEMO_MODE || order.isMock) {
        console.log('✓ Demo mode detected, showing demo modal...');
        setIsProcessing(false);
        setShowDemoModal(true);
        return;
      }

      // Initialize payment (real Razorpay flow)
      await paymentService.initiatePayment(
        order,
        {
          name: user.name,
          email: user.email,
          phone: user.phone,
        },
        async (response) => {
          // Payment successful
          try {
            const result = await paymentService.processPaymentCompletion(
              planIdForPayment,
              response,
              user.id
            );

            if (result.success) {
              // Create lead for payment conversion
              await createLead({
                name: user.name,
                email: user.email,
                phone: user.phone || '+91-0000000000',
                interest: `Subscribed to ${displayPlanName} Plan`,
                source: 'course_enroll',
                message: `Payment successful for ${displayPlanName} plan - ₹${Math.round(selectedPlanPrice * 1.18)} - Payment ID: ${response.razorpay_payment_id}`,
              });

              // Update user subscription
              login({
                ...user,
                subscription: planIdForPayment,
              });
              setStep('success');

              setTimeout(() => {
                toast.success(`Welcome to ${displayPlanName}! Your subscription is now active.`, {
                  duration: 5000,
                  icon: '🎉',
                });
                onClose();
              }, 2500);
            } else {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (error) {
            console.error('Payment completion error:', error);
            toast.error('Payment verification failed');
            setIsProcessing(false);
          }
        },
        (error) => {
          console.error('Payment failed:', error);
          setIsProcessing(false);
        },
        ENV.DEMO_MODE
      );
    } catch (error) {
      console.error('Payment initialization error:', error);
      toast.error('Failed to initialize payment. Please try again.');
      setIsProcessing(false);
    }
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isProcessing ? onClose : undefined}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-linear-to-r from-purple-600 to-purple-700 text-white p-8 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Secure Payment</h2>
                <p className="text-purple-200 mt-1">Complete your {displayPlanName} Plan upgrade</p>
              </div>
              {step !== 'payment' && !isProcessing && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              )}
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Step Indicator */}
              <div className="flex items-center justify-between mb-12">
                {['confirmation', 'details', 'payment', 'success'].map((s, idx) => (
                  <React.Fragment key={s}>
                    <motion.div
                      animate={{
                        scale: ['confirmation', 'details', 'payment', 'success'].indexOf(step) >= idx ? 1 : 0.8,
                        opacity: ['confirmation', 'details', 'payment', 'success'].indexOf(step) >= idx ? 1 : 0.5,
                      }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                        ['confirmation', 'details', 'payment', 'success'].indexOf(step) > idx
                          ? 'bg-green-500 text-white'
                          : ['confirmation', 'details', 'payment', 'success'].indexOf(step) === idx
                          ? 'bg-purple-600 text-white'
                          : 'bg-slate-200 text-slate-400'
                      }`}
                    >
                      {['confirmation', 'details', 'payment', 'success'].indexOf(step) > idx ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        idx + 1
                      )}
                    </motion.div>
                    {idx < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 rounded-full transition-colors ${
                          ['confirmation', 'details', 'payment', 'success'].indexOf(step) > idx
                            ? 'bg-green-500'
                            : 'bg-slate-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {/* STEP 1: CONFIRMATION */}
                {step === 'confirmation' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="bg-linear-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border-2 border-purple-200">
                      <div className="flex items-start space-x-4">
                        <Zap className="h-8 w-8 text-purple-600 shrink-0 mt-1" />
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900 mb-2">
                            {displayPlanName} Plan
                          </h3>
                          <p className="text-4xl font-bold text-purple-600 mb-4">
                            ₹{selectedPlanPrice.toLocaleString()}
                          </p>
                          <div className="space-y-3">
                            {selectedPlanFeatures.map((feature: any, idx: number) => (
                              <div key={idx} className="flex items-center space-x-3">
                                <Check className="h-5 w-5 text-green-600" />
                                <span className="text-slate-700 font-medium">{feature}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        <span className="font-bold">Demo Mode:</span> This is a mock payment flow. Use the pre-filled test card details to proceed.
                      </p>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep('details')}
                      className="w-full bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-5 w-5" />
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP 2: CARDHOLDER DETAILS */}
                {step === 'details' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-bold text-slate-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        id="cardName"
                        type="text"
                        name="cardName"
                        value={cardData.cardName}
                        onChange={handleCardChange}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="John Doe"
                        title="Cardholder name"
                      />
                    </div>

                    <div>
                      <label htmlFor="emailAddress" className="block text-sm font-bold text-slate-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="emailAddress"
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl bg-slate-50 text-slate-500"
                        placeholder={user?.email || 'example@example.com'}
                        title="Email address"
                      />
                    </div>

                    {/* Demo Mode Notice */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        <span className="font-bold">Demo Mode:</span> This is a mock payment flow. Use the pre-filled test card details to proceed.
                      </p>
                    </div>

                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('confirmation')}
                        className="flex-1 px-6 py-3 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:border-slate-400 transition-colors"
                      >
                        Back
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep('payment')}
                        className="flex-1 bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all"
                      >
                        <span>Continue to Card</span>
                        <ArrowRight className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: PAYMENT */}
                {step === 'payment' && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    {/* Mock Credit Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="relative h-56 rounded-2xl overflow-hidden cursor-pointer"
                    >
                      <div className="absolute inset-0 bg-linear-to-br from-purple-600 via-purple-700 to-blue-900" />
                      <div className="absolute inset-0 opacity-30">
                        <div className="absolute top-0 right-0 h-40 w-40 bg-white/20 rounded-full -mr-20 -mt-20" />
                        <div className="absolute bottom-0 left-0 h-32 w-32 bg-white/10 rounded-full -ml-10 -mb-10" />
                      </div>
                      <div className="relative h-full p-6 flex flex-col justify-between text-white">
                        <div>
                          <div className="text-sm opacity-75 mb-4">Card Number</div>
                          <div className="text-2xl font-bold tracking-widest">
                            {cardData.cardNumber}
                          </div>
                        </div>
                        <div className="flex items-end justify-between">
                          <div>
                            <div className="text-xs opacity-75">Cardholder</div>
                            <div className="text-lg font-bold">{cardData.cardName.toUpperCase()}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs opacity-75">Expires</div>
                            <div className="text-xl font-bold">
                              {cardData.expiryMonth}/{cardData.expiryYear.slice(-2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* CVV */}
                    <div>
                      <label htmlFor="cvv" className="block text-sm font-bold text-slate-700 mb-2">
                        CVV/Security Code
                      </label>
                      <input
                        id="cvv"
                        type="text"
                        name="cvv"
                        value={cardData.cvv}
                        onChange={handleCardChange}
                        maxLength={3}
                        className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                        placeholder="123"
                        title="CVV security code"
                      />
                    </div>

                    {/* Security Info */}
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start space-x-3">
                      <Lock className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-green-900">🔒 Secured Payment</p>
                        <p className="text-xs text-green-700 mt-1">Your card details are encrypted with 256-bit SSL security</p>
                      </div>
                    </div>

                    {/* Demo Mode Notice */}
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-900">🧪 Demo Mode Payment</p>
                        <p className="text-xs text-amber-800 mt-1">This is a test transaction. No real payment will be processed. This card will be automatically approved.</p>
                      </div>
                    </div>

                    {/* Amount Summary */}
                    <div className="bg-slate-50 rounded-xl p-4 space-y-3 border border-slate-200">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{displayPlanName} Plan</span>
                        <span className="font-bold text-slate-900">₹{selectedPlanPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">Tax (18%)</span>
                        <span className="font-bold text-slate-900">₹{Math.round(selectedPlanPrice * 0.18).toLocaleString()}</span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                        <span className="text-slate-900 font-bold">Total Amount</span>
                        <span className="text-2xl font-bold text-purple-600">
                          ₹{Math.round(selectedPlanPrice * 1.18).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Pay Button */}
                    <motion.button
                      whileHover={!isProcessing ? { scale: 1.02 } : {}}
                      whileTap={!isProcessing ? { scale: 0.98 } : {}}
                      onClick={handlePayment}
                      disabled={isProcessing}
                      className="w-full bg-linear-to-r from-purple-600 to-purple-700 text-white px-6 py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing Payment...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>Pay ₹{Math.round(selectedPlanPrice * 1.18).toLocaleString()}</span>
                        </>
                      )}
                    </motion.button>
                  </motion.div>
                )}

                {/* STEP 4: SUCCESS */}
                {step === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="text-center space-y-6 py-8"
                  >
                    <motion.div
                      animate={{ scale: [0.8, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center"
                    >
                      <Check className="h-10 w-10 text-green-600" />
                    </motion.div>

                    <div>
                      <h3 className="text-3xl font-bold text-slate-900 mb-2">
                        Payment Successful!
                      </h3>
                      <p className="text-slate-600 text-lg">
                        You're now a {displayPlanName} member
                      </p>
                    </div>

                    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 space-y-3">
                      <p className="text-sm text-green-700">
                        <span className="font-bold">✓ Order Confirmation</span>
                      </p>
                      <div className="text-left space-y-2 text-sm">
                        <p><span className="font-bold">Plan:</span> {displayPlanName}</p>
                        <p><span className="font-bold">Amount:</span> ₹{Math.round(selectedPlanPrice * 1.18).toLocaleString()}</p>
                        <p><span className="font-bold">Status:</span> <span className="text-green-600 font-bold">Active</span></p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-500">
                      Confirmation email sent to <span className="font-bold">{user?.email}</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Demo Razorpay Modal */}
          <AnimatePresence>
            {showDemoModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
              >
                {/* Demo Payment Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="text-white font-bold text-lg">
                        🧪 Razorpay Test Mode
                      </div>
                    </div>
                    <p className="text-blue-100 text-xs mt-1">Demo Payment Gateway</p>
                  </div>

                  {/* Content */}
                  <div className="p-6 space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Amount</span>
                        <span className="text-2xl font-bold text-blue-600">
                          ₹{Math.round(selectedPlanPrice * 1.18).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
                        <span className="text-slate-600 text-sm">Plan</span>
                        <span className="font-semibold text-slate-900">{displayPlanName}</span>
                      </div>
                    </div>

                    {/* Card Display */}
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 text-white space-y-8">
                      <div>
                        <div className="text-xs opacity-75 mb-2">Card Number</div>
                        <div className="text-lg font-mono tracking-widest">
                          {cardData.cardNumber}
                        </div>
                      </div>
                      <div className="flex justify-between items-end">
                        <div>
                          <div className="text-xs opacity-75">Card Holder</div>
                          <div className="font-semibold">{cardData.cardName.toUpperCase()}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs opacity-75">Expires</div>
                          <div className="font-semibold">{cardData.expiryMonth}/{cardData.expiryYear.slice(-2)}</div>
                        </div>
                      </div>
                    </div>

                    {/* Demo Notice */}
                    <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-3">
                      <p className="text-xs font-bold text-amber-900">⚠️ This is a test transaction</p>
                      <p className="text-xs text-amber-700 mt-1">No real payment will be processed. Card will be auto-approved.</p>
                    </div>

                    {/* Processing Status */}
                    {demoModalProcessing && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-center space-x-2">
                          <Loader2 className="h-5 w-5 text-blue-600 animate-spin" />
                          <span className="text-sm font-semibold text-blue-600">Processing payment...</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1 overflow-hidden">
                          <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 3, ease: 'easeInOut' }}
                            className="h-full bg-green-500"
                          />
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <motion.button
                      whileHover={!demoModalProcessing ? { scale: 1.02 } : {}}
                      whileTap={!demoModalProcessing ? { scale: 0.98 } : {}}
                      onClick={async () => {
                        console.log('✓ Demo payment authorize clicked');
                        setDemoModalProcessing(true);
                        // Simulate Razorpay processing
                        await new Promise(resolve => setTimeout(resolve, 3000));
                        console.log('✓ Demo payment processing complete');
                        setDemoModalProcessing(false);
                        // Close modal and trigger payment completion
                        setShowDemoModal(false);
                        // Trigger payment completion after a brief delay
                        setTimeout(() => handleDemoPaymentCompletion(), 300);
                      }}
                      disabled={demoModalProcessing}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center space-x-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {demoModalProcessing ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="h-5 w-5" />
                          <span>Authorize Payment</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </AnimatePresence>
  );
}
