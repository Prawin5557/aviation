import { useState, useEffect } from "react";
import { Bell, Lock, Eye, Globe, Moon, Sun, Shield, Trash2, Loader2, CheckCircle2, Video, Mail, Smartphone, LogOut, MapPin, Calendar, Award, Save } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthStore } from "@/src/store/authStore";
import { apiService } from "@/src/services/api";
import SEO from "@/src/components/common/SEO";
import { cn } from "@/src/lib/utils";
import toast from "react-hot-toast";

export default function Settings() {
  const { user } = useAuthStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'notifications' | 'privacy' | 'security' | 'preferences'>('notifications');
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    jobAlerts: true,
    interviewReminders: true,
    applicationUpdates: true,
    courseUpdates: true,
    marketingEmails: false,
    weeklyDigest: true,
    immediateAlerts: true,
    webinarEmailReminders: true,
    webinarAutoRegisterCategory: false,
    webinarNotifyBeforeStart: true,
    webinarRecordingAccess: true,
    webinarCalendarSync: false,
    profileVisibility: "public",
    showEmail: false,
    showPhone: false,
    darkMode: false,
    language: "en",
    twoFactorAuth: false,
    emailDigest: "daily",
    loginAlerts: true,
    unsubscribeAll: false,
  });

  useEffect(() => {
    loadPreferences();
  }, [user?.id]);

  const loadPreferences = async () => {
    try {
      setIsLoading(true);
      const notifRes = await apiService.getNotificationPreferences(user?.id || 'student1');
      const webinarRes = await apiService.getWebinarPreferences(user?.id || 'student1');
      
      const notifPrefs = notifRes.data;
      const webinarPrefs = webinarRes.data;
      
      setSettings(prev => ({
        ...prev,
        emailNotifications: notifPrefs.emailNotifications ?? true,
        pushNotifications: notifPrefs.pushNotifications ?? false,
        smsNotifications: notifPrefs.smsNotifications ?? false,
        jobAlerts: notifPrefs.jobAlerts ?? true,
        interviewReminders: notifPrefs.interviewReminders ?? true,
        applicationUpdates: notifPrefs.applicationUpdates ?? true,
        courseUpdates: notifPrefs.courseUpdates ?? true,
        marketingEmails: notifPrefs.marketingEmails ?? false,
        weeklyDigest: notifPrefs.weeklyDigest ?? true,
        immediateAlerts: notifPrefs.immediateAlerts ?? true,
        webinarEmailReminders: webinarPrefs.emailReminders ?? true,
        webinarAutoRegisterCategory: webinarPrefs.autoRegisterCategory ?? false,
        webinarNotifyBeforeStart: webinarPrefs.notifyBeforeStart ?? true,
        webinarRecordingAccess: webinarPrefs.recordingAccess ?? true,
        webinarCalendarSync: webinarPrefs.calendarSync ?? false,
      }));
    } catch (error) {
      console.error("Failed to load preferences:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectChange = (key: keyof typeof settings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const notifPrefs = {
        emailNotifications: settings.emailNotifications,
        pushNotifications: settings.pushNotifications,
        smsNotifications: settings.smsNotifications,
        jobAlerts: settings.jobAlerts,
        interviewReminders: settings.interviewReminders,
        applicationUpdates: settings.applicationUpdates,
        courseUpdates: settings.courseUpdates,
        marketingEmails: settings.marketingEmails,
        weeklyDigest: settings.weeklyDigest,
        immediateAlerts: settings.immediateAlerts,
      };
      
      const webinarPrefs = {
        emailReminders: settings.webinarEmailReminders,
        autoRegisterCategory: settings.webinarAutoRegisterCategory,
        notifyBeforeStart: settings.webinarNotifyBeforeStart,
        recordingAccess: settings.webinarRecordingAccess,
        calendarSync: settings.webinarCalendarSync,
      };
      
      await apiService.updateNotificationPreferences(user?.id || 'student1', notifPrefs);
      await apiService.updateWebinarPreferences(user?.id || 'student1', webinarPrefs);
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = () => {
    toast.error("Account deletion is currently unavailable. Please contact support.");
  };

  const ToggleSwitch = ({ enabled, onChange, ariaLabel }: { enabled: boolean; onChange: () => void; ariaLabel?: string }) => (
    <label className="relative inline-flex h-6 w-11 cursor-pointer items-center">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        aria-label={ariaLabel || 'Toggle'}
        className="peer sr-only"
      />
      <span className="h-6 w-11 rounded-full bg-slate-200 transition-colors duration-200 peer-checked:bg-purple-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 peer-focus:ring-offset-2" />
      <span className={cn(
        "pointer-events-none absolute left-1 inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200",
        enabled ? "translate-x-5" : "translate-x-0"
      )} />
    </label>
  );

  const tabs = [
    { id: 'notifications' as const, label: 'Notifications', icon: Bell },
    { id: 'privacy' as const, label: 'Privacy', icon: Eye },
    { id: 'security' as const, label: 'Security', icon: Shield },
    { id: 'preferences' as const, label: 'Preferences', icon: Globe },
  ];

  return (
    <div className="space-y-8 pb-20">
      <SEO title="Settings" description="Manage your account settings and preferences" />
      
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900">Settings</h1>
            <p className="text-slate-500 mt-2">Manage your account preferences and privacy settings</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSave}
            disabled={isSaving || isLoading}
            className="premium-button-primary px-8 py-3 flex items-center space-x-2 min-w-40 justify-center"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>Save Changes</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Profile Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 flex items-center space-x-6"
        >
          <div className="relative">
            <img
              src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=random`}
              alt={user?.name}
              className="h-20 w-20 rounded-full object-cover border-2 border-purple-200"
            />
            <div className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-slate-900">{user?.name || 'User'}</h3>
            <p className="text-slate-500">{user?.email}</p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="inline-flex items-center space-x-1 text-xs bg-purple-50 text-purple-700 px-3 py-1 rounded-full">
                <Award className="h-3 w-3" />
                <span className="capitalize">{user?.role || 'Student'}</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                <Calendar className="h-3 w-3" />
                <span>Member since Jan 2024</span>
              </span>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition-colors">
            Edit Profile
          </button>
        </motion.div>
      </motion.div>

      {isLoading ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-[60vh] flex items-center justify-center"
        >
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin" />
            <p className="text-slate-500">Loading your settings...</p>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 bg-slate-100/50 p-2 rounded-xl backdrop-blur-sm border border-slate-200/50"
          >
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-purple-600 shadow-md'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </motion.button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Notification Channels */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Notification Channels</h2>
                      <p className="text-sm text-slate-500">Choose how you want to receive notifications</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "emailNotifications", label: "Email Notifications", desc: "Receive updates via email", icon: Mail },
                      { key: "pushNotifications", label: "Push Notifications", desc: "Browser & app notifications", icon: Bell },
                      { key: "smsNotifications", label: "SMS Notifications", desc: "Text message alerts", icon: Smartphone },
                    ].map((item) => (
                      <motion.div
                        key={item.key}
                        whileHover={{ backgroundColor: '#f8fafc' }}
                        className="flex items-center justify-between py-4 px-4 rounded-lg border border-slate-200/50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                            <item.icon className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{item.label}</p>
                            <p className="text-sm text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={() => handleToggle(item.key as keyof typeof settings)}
                          ariaLabel={item.label}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Notification Preferences */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Content Preferences</h2>
                      <p className="text-sm text-slate-500">What updates would you like to receive</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "jobAlerts", label: "Job Alerts", desc: "New jobs matching your profile" },
                      { key: "interviewReminders", label: "Interview Reminders", desc: "Upcoming interview alerts" },
                      { key: "applicationUpdates", label: "Application Updates", desc: "Status changes on your applications" },
                      { key: "courseUpdates", label: "Course Updates", desc: "New lessons and announcements" },
                      { key: "weeklyDigest", label: "Weekly Digest", desc: "Summarized weekly updates" },
                      { key: "immediateAlerts", label: "Immediate Alerts", desc: "Urgent notifications (disables batching)" },
                      { key: "marketingEmails", label: "Marketing Emails", desc: "Promotional content and offers" },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={() => handleToggle(item.key as keyof typeof settings)}
                          ariaLabel={item.label}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Email Digest */}
                <div className="glass-card p-8 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                    <Mail className="h-5 w-5 text-purple-600" />
                    <span>Email Digest Frequency</span>
                  </h3>
                  <select
                    aria-label="Email digest frequency"
                    value={settings.emailDigest}
                    onChange={(e) => handleSelectChange("emailDigest", e.target.value)}
                    className="w-full h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  >
                    <option value="immediate">Immediate</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                {/* Webinar Preferences */}
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Video className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Webinar Preferences</h2>
                      <p className="text-sm text-slate-500">Customize your webinar experience</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: "webinarEmailReminders", label: "Email Reminders", desc: "Get reminders before webinars start" },
                      { key: "webinarAutoRegisterCategory", label: "Auto-Register by Category", desc: "Automatically register for preferred categories" },
                      { key: "webinarNotifyBeforeStart", label: "Start Notifications", desc: "Get notified when webinar starts" },
                      { key: "webinarRecordingAccess", label: "Recording Access", desc: "Access recorded webinars after event" },
                      { key: "webinarCalendarSync", label: "Calendar Sync", desc: "Automatically add webinars to your calendar" },
                    ].map((item, idx) => (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <div>
                          <p className="font-bold text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={() => handleToggle(item.key as keyof typeof settings)}
                          ariaLabel={item.label}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Eye className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Profile Visibility</h2>
                      <p className="text-sm text-slate-500">Control who can see your profile</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: "public", label: "Public", desc: "Everyone can see" },
                        { value: "recruiters", label: "Recruiters Only", desc: "Only recruiters" },
                        { value: "private", label: "Private", desc: "Only connections" },
                      ].map(option => (
                        <motion.button
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          onClick={() => handleSelectChange("profileVisibility", option.value)}
                          className={`p-4 rounded-xl border-2 transition-all text-left ${
                            settings.profileVisibility === option.value
                              ? 'border-purple-600 bg-purple-50'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <p className="font-bold text-slate-900">{option.label}</p>
                          <p className="text-sm text-slate-500">{option.desc}</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-4">
                    {[
                      { key: "showEmail", label: "Show Email Address", desc: "Display email on public profile" },
                      { key: "showPhone", label: "Show Phone Number", desc: "Display phone on public profile" },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-slate-50 transition-colors">
                        <div>
                          <p className="font-bold text-slate-900">{item.label}</p>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                        <ToggleSwitch
                          enabled={settings[item.key as keyof typeof settings] as boolean}
                          onChange={() => handleToggle(item.key as keyof typeof settings)}
                          ariaLabel={item.label}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                key="security"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Account Security</h2>
                      <p className="text-sm text-slate-500">Protect your account</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-slate-200/50">
                      <div>
                        <p className="font-bold text-slate-900">Two-Factor Authentication</p>
                        <p className="text-sm text-slate-500">Add an extra layer of security</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.twoFactorAuth}
                        onChange={() => handleToggle("twoFactorAuth")}
                        ariaLabel="Two-Factor Authentication"
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-slate-200/50">
                      <div>
                        <p className="font-bold text-slate-900">Login Alerts</p>
                        <p className="text-sm text-slate-500">Get alerted on new login attempts</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.loginAlerts}
                        onChange={() => handleToggle("loginAlerts")}
                        ariaLabel="Login Alerts"
                      />
                    </div>
                  </div>
                </div>

                <div className="glass-card p-8 space-y-6">
                  <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-purple-600" />
                    <span>Password Management</span>
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Lock className="h-4 w-4" />
                    <span>Change Password</span>
                  </motion.button>
                </div>

                <div className="glass-card p-8 space-y-4 border border-red-100">
                  <h3 className="font-bold text-red-600 flex items-center space-x-2">
                    <LogOut className="h-5 w-5" />
                    <span>Sign Out</span>
                  </h3>
                  <p className="text-sm text-slate-500">Sign out from all devices</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-semibold transition-colors"
                  >
                    Sign Out Everywhere
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                key="preferences"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="glass-card p-8 space-y-6">
                  <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                    <div className="h-10 w-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                      <Globe className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">General Preferences</h2>
                      <p className="text-sm text-slate-500">Customize your experience</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-slate-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                          {settings.darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Dark Mode</p>
                          <p className="text-sm text-slate-500">Toggle dark theme</p>
                        </div>
                      </div>
                      <ToggleSwitch
                        enabled={settings.darkMode}
                        onChange={() => handleToggle("darkMode")}
                        ariaLabel="Dark Mode"
                      />
                    </div>

                    <div className="flex items-center justify-between py-4 px-4 rounded-lg border border-slate-200/50">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Language</p>
                          <p className="text-sm text-slate-500">Select your preferred language</p>
                        </div>
                      </div>
                      <select
                        aria-label="Preferred language"
                        value={settings.language}
                        onChange={(e) => handleSelectChange("language", e.target.value)}
                        className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-purple-500 focus:outline-none"
                      >
                        <option value="en">English</option>
                        <option value="hi">Hindi</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Account Info */}
                <div className="glass-card p-8 space-y-4">
                  <h3 className="font-bold text-slate-900 flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-purple-600" />
                    <span>Account Information</span>
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-2 px-4 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Email Address</span>
                      <span className="font-medium text-slate-900">{user?.email || "john@example.com"}</span>
                    </div>
                    <div className="flex justify-between py-2 px-4 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Account Type</span>
                      <span className="font-medium text-slate-900 capitalize">{user?.role || "Student"}</span>
                    </div>
                    <div className="flex justify-between py-2 px-4 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Member Since</span>
                      <span className="font-medium text-slate-900">January 2024</span>
                    </div>
                    <div className="flex justify-between py-2 px-4 rounded-lg bg-slate-50">
                      <span className="text-slate-500">Account Status</span>
                      <span className="font-medium text-green-600">✓ Active</span>
                    </div>
                  </div>
                </div>

                {/* Danger Zone */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="glass-card p-8 space-y-4 border border-red-200 bg-red-50/30"
                >
                  <h3 className="font-bold text-red-600 flex items-center space-x-2">
                    <Trash2 className="h-5 w-5" />
                    <span>Danger Zone</span>
                  </h3>
                  <p className="text-sm text-slate-500">
                    Once you delete your account, there is no going back. All your data will be permanently deleted. Please be certain.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleDeleteAccount}
                    className="w-full py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl text-sm font-bold transition-colors flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </motion.button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
