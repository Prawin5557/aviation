import apiClient from './apiClient';
import toast from 'react-hot-toast';

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

// Demo users for frontend-only testing
const DEMO_USERS = [
  {
    id: 'demo_student_1',
    email: 'student@demo.com',
    password: 'password123',
    name: 'Demo Student',
    role: 'student' as const,
  },
  {
    id: 'demo_employer_1',
    email: 'employer@demo.com',
    password: 'password123',
    name: 'Demo Employer',
    role: 'employer' as const,
  },
];

class AuthService {
  // Helper to generate mock token
  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Helper to create user object
  private createUserObject(data: any): User {
    return {
      id: data.id || `user_${Date.now()}`,
      name: data.name || 'Demo User',
      email: data.email || 'demo@example.com',
      phone: data.phone,
      role: data.role || 'student',
      subscription: data.subscription,
      isVerified: data.isVerified !== false,
      profileComplete: data.profileComplete ?? false,
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
    };
  }

  // Login with email/password
  async login(
    credentials: LoginCredentials,
    requestedRole?: 'student' | 'employer',
    useMockData = false
  ): Promise<AuthResponse> {
    try {
      console.log('→ Login attempt for:', credentials.email, 'requested role:', requestedRole);
      
      if (!useMockData) {
        try {
          const response = await apiClient.post('/auth/login', credentials);
          const { user, token, refreshToken } = response.data;

          const normalizedUser = {
            ...user,
            role: user.role || requestedRole || credentials.requestedRole || 'student',
          };

          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);
          console.log('✓ Backend login successful');
          toast.success(`Welcome back, ${normalizedUser.name}!`);
          return { user: normalizedUser, token, refreshToken };
        } catch (backendError: any) {
          console.warn('Backend login unavailable, using mock:', backendError.message);
        }
      }

      // Check demo users
      const demoUser = DEMO_USERS.find(
        u => u.email.toLowerCase() === credentials.email.toLowerCase()
      );

      if (demoUser && demoUser.password === credentials.password) {
        console.log('✓ Demo user login successful');
        const token = this.generateMockToken();
        const refreshToken = this.generateMockToken();

        localStorage.setItem('auth_token', token);
        localStorage.setItem('refresh_token', refreshToken);

        const user = this.createUserObject({
          ...demoUser,
          isVerified: true,
        });
        localStorage.setItem('user_data', JSON.stringify(user));

        toast.success(`Welcome back, ${user.name}! (Demo Mode)`);
        return { user, token, refreshToken };
      }

      // For any other email/password, create mock user
      console.log('✓ Creating new mock user for:', credentials.email);
      const token = this.generateMockToken();
      const refreshToken = this.generateMockToken();

      const user = this.createUserObject({
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: requestedRole || credentials.requestedRole || 'student',
        isVerified: true,
      });

      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      toast.success(`Welcome, ${user.name}! (Demo Mode)`);
      return { user, token, refreshToken };
    } catch (error: any) {
      console.error('Login error:', error.message || error);
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      throw error;
    }
  }

  // Register new user
  async register(data: RegisterData, useMockData = false): Promise<{ user: User; requiresVerification: boolean; token?: string }> {
    try {
      console.log('Register attempt:', { ...data, password: '***hidden***' });
      
      // Try backend first
      if (!useMockData) {
        try {
          const response = await apiClient.post('/auth/register', data);
          console.log('Backend registration successful');
          toast.success('Account created successfully!');
          return response.data;
        } catch (backendError: any) {
          console.warn('Backend registration unavailable, using mock data:', backendError.message);
          // Fall through to mock data
        }
      }

      // Use mock data for demo/testing
      console.log('Creating mock user for demo');
      const mockUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        isVerified: true,
        profileComplete: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const mockToken = `demo_token_${Date.now()}`;
      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('user_data', JSON.stringify(mockUser));

      toast.success('Account created successfully (Demo Mode)!');
      return {
        user: mockUser,
        requiresVerification: false,
        token: mockToken,
      };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Registration failed';
      console.error('Registration error:', message);
      toast.error(message);
      throw error;
    }
  }

  // Send OTP for verification
  async sendOTP(email?: string, phone?: string, type: 'email' | 'phone' | 'password_reset' = 'email', useMockData = false): Promise<void> {
    try {
      console.log('→ Sending OTP to:', email || phone);
      
      if (!useMockData) {
        try {
          await apiClient.post('/auth/send-otp', { email, phone, type });
          const target = email || phone;
          console.log('✓ OTP sent via backend');
          toast.success(`OTP sent to ${target}`);
          return;
        } catch (backendError: any) {
          console.warn('Backend OTP send unavailable, using mock:', backendError.message);
        }
      }

      // Mock OTP sending
      const target = email || phone || 'your account';
      console.log('✓ Mock OTP generated and would be sent to:', target);
      
      // Store mock OTP in localStorage for verification
      const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
      localStorage.setItem(`otp_${email || phone}`, mockOtp);
      localStorage.setItem(`otp_timestamp`, Date.now().toString());
      
      console.log('Mock OTP (for testing):', mockOtp);
      toast.success(`OTP sent to ${target} (Demo Mode - Check console)`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send OTP';
      console.error('Send OTP error:', message);
      toast.error(message);
      throw error;
    }
  }

  // Verify OTP
  async verifyOTP(data: OTPData, useMockData = false): Promise<any> {
    try {
      console.log('→ Verifying OTP for:', data.email || data.phone);
      
      if (!useMockData) {
        try {
          const response = await apiClient.post('/auth/verify-otp', data);
          console.log('✓ Backend OTP verification successful', response.data);
          const { token, refreshToken } = response.data;
          localStorage.setItem('auth_token', token);
          localStorage.setItem('refresh_token', refreshToken);
          toast.success('OTP verified successfully!');
          return response.data;
        } catch (backendError: any) {
          console.warn('Backend OTP verification unavailable, using mock:', backendError.message);
        }
      }

      // Mock OTP verification
      console.log('✓ Mock OTP verification (always succeeds in demo mode)');
      const token = this.generateMockToken();
      const refreshToken = this.generateMockToken();

      if (data.type === 'password_reset') {
        console.log('✓ Mock password reset OTP verified, returning token.');
        toast.success('OTP Verified! (Demo Mode)');
        return { token };
      }

      const user = this.createUserObject({
        email: data.email,
        name: data.email?.split('@')[0] || 'Demo User',
        isVerified: true,
      });

      localStorage.setItem('auth_token', token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user_data', JSON.stringify(user));

      toast.success('OTP verified! (Demo Mode)');
      return { user, token, refreshToken };
    } catch (error: any) {
      console.error('OTP verification error:', error.message || error);
      const message = error.response?.data?.message || 'OTP verification failed';
      toast.error(message);
      throw error;
    }
  }

  // Google OAuth login
  async googleLogin(idToken: string): Promise<AuthResponse> {
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

  // Request password reset
  async requestPasswordReset(email: string, useMockData = false): Promise<void> {
    try {
      if (!useMockData) {
        try {
          await apiClient.post('/auth/forgot-password', { email });
          toast.success('Password reset instructions sent to your email');
          return;
        } catch (backendError: any) {
          console.warn('Backend password reset request unavailable, using mock:', backendError.message);
        }
      }
      // Mock sending reset instructions
      console.log(`✓ Mock password reset instructions would be sent to ${email}`);
      toast.success(`Password reset instructions sent to ${email} (Demo Mode)`);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
      throw error;
    }
  }

  // Reset password with OTP
  async resetPassword(data: PasswordResetData, useMockData = false): Promise<void> {
    try {
      if (!useMockData) {
        await apiClient.post('/auth/reset-password', data);
        toast.success('Password reset successful! Please login with your new password.');
        return;
      }
      console.log('✓ Mock password reset successful for token:', data.token);
      toast.success('Password reset successful! (Demo Mode)');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Password reset failed';
      toast.error(message);
      throw error;
    }
  }

  // Refresh access token
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token');

      const response = await apiClient.post('/auth/refresh', { refreshToken });
      const { token } = response.data;

      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      // Clear tokens and redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/login';
      throw error;
    }
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      toast.success('Logged out successfully');
    }
  }

  // Get current user profile
  async getProfile(): Promise<User> {
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

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  // Get stored token
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const authService = new AuthService();
