import apiClient from './apiClient';
import toast from 'react-hot-toast';
import { logger } from '@/src/utils/logger';
import { ENV } from '@/src/config/env';

const DEMO_USER_STORAGE_KEY = 'frontend_demo_user';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'student' | 'employer' | 'admin';
  subscription?: string;
  isVerified: boolean;
  profileComplete: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  requestedRole?: 'student' | 'employer';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'student' | 'employer';
  companyName?: string;
  hrName?: string;
  companyDetails?: string;
}

export interface OTPData {
  email?: string;
  phone?: string;
  otp: string;
  type: 'email' | 'phone' | 'password_reset';
}

export interface PasswordResetData {
  token: string;
  newPassword: string;
}

class AuthService {
  async login(
    credentials: LoginCredentials,
    requestedRole?: 'student' | 'employer'
  ): Promise<AuthResponse> {
    if (ENV.FRONTEND_ONLY) {
      const role = requestedRole || credentials.requestedRole || 'student';
      const demoUser: User = {
        id: `demo-${role}-user`,
        name: credentials.email.split('@')[0] || 'Demo User',
        email: credentials.email,
        role,
        isVerified: true,
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const token = 'frontend-demo-token';
      const refreshToken = 'frontend-demo-refresh-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      toast.success(`Welcome back, ${demoUser.name}!`);
      return { user: demoUser, token, refreshToken };
    }

    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { user, token, refreshToken } = response.data;

      const normalizedUser = {
        ...user,
        role: user.role || requestedRole || credentials.requestedRole || 'student',
      };

      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      toast.success(`Welcome back, ${normalizedUser.name}!`);
      return { user: normalizedUser, token, refreshToken };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  }

  async register(data: RegisterData): Promise<{ user: User; requiresVerification: boolean; token?: string }> {
    if (ENV.FRONTEND_ONLY) {
      const demoUser: User = {
        id: `demo-${data.role}-user`,
        name: data.name,
        email: data.email,
        role: data.role,
        isVerified: true,
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      toast.success('Account created successfully!');
      return { user: demoUser, requiresVerification: false, token: 'frontend-demo-token' };
    }

    try {
      const response = await apiClient.post('/auth/register', data);
      toast.success('Account created successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      throw error;
    }
  }

  async sendOTP(email?: string, phone?: string, type: 'email' | 'phone' | 'password_reset' = 'email'): Promise<void> {
    if (ENV.FRONTEND_ONLY) {
      const target = email || phone || 'your account';
      toast.success(`OTP sent to ${target}`);
      return;
    }

    try {
      await apiClient.post('/auth/send-otp', { email, phone, type });
      const target = email || phone || 'your account';
      toast.success(`OTP sent to ${target}`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      toast.error(message);
      throw error;
    }
  }

  async verifyOTP(data: OTPData): Promise<any> {
    if (ENV.FRONTEND_ONLY) {
      const token = 'frontend-demo-token';
      const refreshToken = 'frontend-demo-refresh-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      toast.success('OTP verified successfully!');
      return { token, refreshToken };
    }

    try {
      const response = await apiClient.post('/auth/verify-otp', data);
      const { token, refreshToken } = response.data;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      toast.success('OTP verified successfully!');
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      throw error;
    }
  }

  // Google OAuth login
  async googleLogin(idToken: string): Promise<AuthResponse> {
    if (ENV.FRONTEND_ONLY) {
      const demoUser: User = {
        id: 'demo-google-user',
        name: 'Demo Google User',
        email: 'demo.user@example.com',
        role: 'student',
        isVerified: true,
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const token = 'frontend-demo-token';
      const refreshToken = 'frontend-demo-refresh-token';
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(demoUser));
      toast.success(`Welcome, ${demoUser.name}!`);
      return { user: demoUser, token, refreshToken };
    }

    try {
      const response = await apiClient.post('/auth/google', { idToken });
      const { user, token, refreshToken } = response.data;

      // Store tokens
      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);

      toast.success(`Welcome, ${user.name}!`);
      return response.data;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Google login failed';
      toast.error(message);
      throw error;
    }
  }

  async requestPasswordReset(email: string): Promise<void> {
    if (ENV.FRONTEND_ONLY) {
      toast.success('Password reset instructions sent to your email');
      return;
    }

    try {
      await apiClient.post('/auth/forgot-password', { email });
      toast.success('Password reset instructions sent to your email');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  }

  async resetPassword(data: PasswordResetData): Promise<void> {
    if (ENV.FRONTEND_ONLY) {
      toast.success('Password reset successful! Please login with your new password.');
      return;
    }

    try {
      await apiClient.post('/auth/reset-password', data);
      toast.success('Password reset successful! Please login with your new password.');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    if (ENV.FRONTEND_ONLY) {
      const token = 'frontend-demo-token';
      localStorage.setItem('auth_token', token);
      return token;
    }

    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token } = response.data;

      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      logger.warn('Refresh token failed, clearing session');
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (ENV.FRONTEND_ONLY) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem(DEMO_USER_STORAGE_KEY);
      localStorage.removeItem('auth-storage');
      toast.success('Logged out successfully');
      return;
    }

    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      logger.warn('Logout API request failed', { error });
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('auth-storage');
      toast.success('Logged out successfully');
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
    if (ENV.FRONTEND_ONLY) {
      const stored = localStorage.getItem(DEMO_USER_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }

      const fallbackUser: User = {
        id: 'demo-student-user',
        name: 'Demo User',
        email: 'demo.user@example.com',
        role: 'student',
        isVerified: true,
        profileComplete: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(fallbackUser));
      return fallbackUser;
    }

    try {
      const response = await apiClient.get('/auth/profile');
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to get profile';
      toast.error(message);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(data: Partial<User>): Promise<User> {
    if (ENV.FRONTEND_ONLY) {
      const current = await this.getProfile();
      const updated = { ...current, ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(DEMO_USER_STORAGE_KEY, JSON.stringify(updated));
      toast.success('Profile updated successfully');
      return updated;
    }

    try {
      const response = await apiClient.put('/auth/profile', data);
      toast.success('Profile updated successfully');
      return response.data.user;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
      throw error;
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
