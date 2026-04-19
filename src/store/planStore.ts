import { create } from 'zustand';
import { apiService } from '@/src/services/api';

interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  features: string[];
  permissions: string[];
  razorpay_plan_id: string | null;
  type?: 'student' | 'employer';
  isActive?: boolean;
}

interface PlanState {
  plans: Plan[];
  isLoading: boolean;
  fetchPlans: () => Promise<void>;
  hasPermission: (subscriptionId: string | undefined, permissionId: string) => boolean;
}

export const usePlanStore = create<PlanState>((set, get) => ({
  plans: [],
  isLoading: false,
  fetchPlans: async () => {
    set({ isLoading: true });
    try {
      const res = await apiService.getPlans();
      set({ plans: res.data, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch plans:", error);
      set({ isLoading: false });
    }
  },
  hasPermission: (subscriptionId, permissionId) => {
    if (!subscriptionId) return false;
    const plan = get().plans.find(p => p.id.toLowerCase() === subscriptionId.toLowerCase());
    return plan ? plan.permissions.includes(permissionId) : false;
  }
}));
