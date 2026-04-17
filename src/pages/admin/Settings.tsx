import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Key,
  Database,
  Shield,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Plus,
  Mail,
  Server,
  AlertCircle,
  CheckCircle2,
  ToggleRight,
  ToggleLeft,
  Download,
  Loader2,
  FileText,
  Activity,
  Save,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      toast.success("Settings saved successfully!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyApiKey = () => {
    const apiKey = import.meta.env.VITE_STRIPE_API_KEY || "";
    if (!apiKey) {
      toast.error("API key not configured");
      return;
    }
    navigator.clipboard.writeText(apiKey);
    toast.success("API key copied to clipboard!");
  };

  const handleGenerateNewKey = () => {
    toast.success("New API key generated!");
  };

  const handleExportData = () => {
    toast.success("Data export started. You'll receive an email shortly.");
  };

  const handleBackup = () => {
    toast.success("Backup initiated. This may take a few minutes.");
  };

  return (
    <div className="p-8 space-y-8 pb-20">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-4xl font-bold text-slate-900 flex items-center gap-3">
          <Settings className="h-8 w-8 text-purple-600" />
          System Settings
        </h1>
        <p className="text-slate-600 mt-2">Configure your FlightDeck platform settings.</p>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 border-b border-slate-200 overflow-x-auto"
      >
        {[
          { id: "general", label: "General", icon: Settings },
          { id: "notifications", label: "Notifications", icon: Bell },
          { id: "security", label: "Security", icon: Lock },
          { id: "api", label: "API Keys", icon: Key },
          { id: "backup", label: "Backup & Data", icon: Database },
          { id: "system", label: "System Status", icon: Server },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 font-bold text-sm uppercase tracking-wider transition-all border-b-2 flex items-center gap-2 whitespace-nowrap",
                activeTab === tab.id
                  ? "border-purple-600 text-purple-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </motion.div>

      {/* Tab Content */}
      <div className="space-y-8">
        {/* General Settings */}
        {activeTab === "general" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid gap-8">
              {/* Platform Settings */}
              <div className="glass-card p-8 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-purple-600" />
                  Platform Settings
                </h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      title="Platform name"
                      placeholder="Enter platform name"
                      defaultValue="FlightDeck"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Support Email
                      </label>
                      <input
                        type="email"
                        title="Support email address"
                        placeholder="support@example.com"
                        defaultValue="support@flightdeck.io"
                        className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        title="Support phone number"
                        placeholder="+1 (800) FLIGHT-1"
                        defaultValue="+1 (800) FLIGHT-1"
                        className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-3">
                      <div className={cn(
                        "relative inline-flex h-8 w-14 cursor-pointer rounded-full transition-colors",
                        maintenanceMode ? "bg-red-600" : "bg-emerald-600"
                      )}>
                        <input
                          type="checkbox"
                          checked={maintenanceMode}
                          onChange={(e) => setMaintenanceMode(e.target.checked)}
                          className="sr-only"
                        />
                        <span className={cn(
                          "inline-block h-6 w-6 transform rounded-full bg-white transition-transform absolute top-1",
                          maintenanceMode ? "translate-x-7" : "translate-x-1"
                        )} />
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        Maintenance Mode {maintenanceMode && "🚫"}
                      </span>
                    </label>
                    <p className="text-xs text-slate-500 mt-1 ml-17">
                      {maintenanceMode 
                        ? "Platform is in maintenance mode. Only admins can access."
                        : "Platform is live for all users."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Localization */}
              <div className="glass-card p-8 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-bold text-slate-900 mb-6">Localization</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="admin-default-language" className="block text-sm font-bold text-slate-700 mb-2">
                      Default Language
                    </label>
                    <select
                      id="admin-default-language"
                      aria-label="Select default language"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    >
                      <option>English (US)</option>
                      <option>Hindi</option>
                      <option>Spanish</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="admin-default-timezone" className="block text-sm font-bold text-slate-700 mb-2">
                      Default Timezone
                    </label>
                    <select
                      id="admin-default-timezone"
                      aria-label="Select default timezone"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    >
                      <option>IST (Indian Standard Time)</option>
                      <option>UTC (Coordinated Universal Time)</option>
                      <option>EST (Eastern Standard Time)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications */}
        {activeTab === "notifications" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-purple-600" />
                Notification Channels
              </h3>
              <div className="space-y-6">
                {[
                  { 
                    id: "email", 
                    name: "Email Notifications", 
                    description: "Receive updates via email",
                    value: emailNotifications,
                    setState: setEmailNotifications,
                    icon: Mail
                  },
                  { 
                    id: "push", 
                    name: "Push Notifications", 
                    description: "In-app and browser notifications",
                    value: pushNotifications,
                    setState: setPushNotifications,
                    icon: Bell
                  },
                ].map((channel) => {
                  const Icon = channel.icon;
                  return (
                    <div key={channel.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg mt-1">
                          <Icon className="h-4 w-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{channel.name}</p>
                          <p className="text-xs text-slate-600">{channel.description}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => channel.setState(!channel.value)}
                        className="focus:outline-none"
                      >
                        {channel.value ? (
                          <ToggleRight className="h-6 w-6 text-emerald-600 cursor-pointer" />
                        ) : (
                          <ToggleLeft className="h-6 w-6 text-slate-400 cursor-pointer" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Email Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    SMTP Server
                  </label>
                  <input
                    type="text"
                    title="SMTP server address"
                    placeholder="smtp.gmail.com"
                    defaultValue="smtp.gmail.com"
                    className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      SMTP Port
                    </label>
                    <input
                      type="number"
                      title="SMTP port number"
                      placeholder="587"
                      defaultValue="587"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                      Sender Email
                    </label>
                    <input
                      type="email"
                      title="Sender email address"
                      placeholder="noreply@flightdeck.io"
                      defaultValue="noreply@flightdeck.io"
                      className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                    />
                  </div>
                </div>
                <button className="w-full px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm transition-all">
                  Test Email Connection
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security */}
        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Shield className="h-5 w-5 text-purple-600" />
                Security Policies
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Password Policy Min Length
                  </label>
                  <input
                    type="number"
                    title="Minimum password length"
                    placeholder="8"
                    defaultValue="8"
                    className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input type="number" title="Session timeout in minutes" placeholder="30" defaultValue="30" className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all" />
                </div>
                <div>
                  <label className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="w-5 h-5 rounded text-purple-600"
                    />
                    <span className="text-sm font-bold text-slate-700">
                      Require 2-Factor Authentication
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                Danger Zone
              </h3>
              <div className="space-y-4">
                <button className="w-full px-4 py-3 bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 rounded-lg font-bold text-sm transition-all">
                  Reset All User Passwords
                </button>
                <button className="w-full px-4 py-3 bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 rounded-lg font-bold text-sm transition-all">
                  Clear All Cache
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* API Keys */}
        {activeTab === "api" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Key className="h-5 w-5 text-purple-600" />
                API Management
              </h3>
              <div className="space-y-6">
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">Production API Key</p>
                  <div className="flex items-center gap-2">
                    <input
                      type={showApiKey ? "text" : "password"}
                      title="API Key field"
                      placeholder="API Key"
                      value={import.meta.env.VITE_STRIPE_API_KEY || "Not configured"}
                      readOnly
                      className="flex-1 px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-lg font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                      title={showApiKey ? "Hide" : "Show"}
                    >
                      {showApiKey ? (
                        <EyeOff className="h-5 w-5 text-slate-600" />
                      ) : (
                        <Eye className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={handleCopyApiKey}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-all"
                      title="Copy"
                    >
                      <Copy className="h-5 w-5 text-slate-600" />
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    🔒 Created on Jan 15, 2024 • Last used Jan 17, 2024
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <button
                    onClick={handleGenerateNewKey}
                    className="w-full px-4 py-3 bg-purple-100 text-purple-700 hover:bg-purple-200 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Generate New Key
                  </button>
                  <button className="w-full px-4 py-3 bg-red-50 text-red-700 border-2 border-red-200 hover:bg-red-100 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Revoke Key
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6">API Documentation</h3>
              <div className="space-y-3">
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all">
                  <span className="font-bold text-slate-900">REST API Reference</span>
                  <span className="text-slate-400">→</span>
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all">
                  <span className="font-bold text-slate-900">Webhook Events</span>
                  <span className="text-slate-400">→</span>
                </a>
                <a href="#" className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all">
                  <span className="font-bold text-slate-900">SDK Documentation</span>
                  <span className="text-slate-400">→</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* Backup & Data */}
        {activeTab === "backup" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-600" />
                Database Management
              </h3>
              <div className="space-y-6">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 font-bold">
                    ℹ️ Last backup: Jan 17, 2024 at 2:30 AM UTC
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={handleBackup}
                    className="px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Start Backup Now
                  </button>
                  <button className="px-4 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm transition-all">
                    View Backups
                  </button>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Data Export
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-2">Export Format</p>
                  <select
                    title="Select export format"
                    className="w-full px-4 py-3 bg-white/50 border-2 border-slate-200 rounded-lg focus:border-purple-400 focus:ring-2 focus:ring-purple-500/50 outline-none transition-all"
                  >
                    <option>CSV</option>
                    <option>JSON</option>
                    <option>Excel</option>
                  </select>
                </div>
                <button
                  onClick={handleExportData}
                  className="w-full px-4 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Export All Data
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* System Status */}
        {activeTab === "system" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-2 gap-6">
              {[
                { name: "API Server", status: "Operational", uptime: "99.98%" },
                { name: "Database", status: "Operational", uptime: "99.99%" },
                { name: "Cache Layer", status: "Operational", uptime: "99.95%" },
                { name: "Email Service", status: "Operational", uptime: "99.97%" },
              ].map((service) => (
                <div key={service.name} className="glass-card p-6 rounded-2xl border border-slate-200">
                  <div className="flex items-start justify-between mb-4">
                    <p className="font-bold text-slate-900">{service.name}</p>
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 bg-emerald-600 rounded-full animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700">{service.status}</span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">Uptime: <strong>{service.uptime}</strong></p>
                </div>
              ))}
            </div>

            <div className="glass-card p-8 rounded-2xl border border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Activity className="h-5 w-5 text-purple-600" />
                System Metrics
              </h3>
              <div className="space-y-4">
                {[
                  { label: "CPU Usage", value: "34%", color: "bg-blue-600" },
                  { label: "Memory Usage", value: "62%", color: "bg-purple-600" },
                  { label: "Database Connections", value: "127/200", color: "bg-emerald-600" },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between mb-2">
                      <p className="text-sm font-bold text-slate-700">{metric.label}</p>
                      <p className="text-sm font-bold text-slate-900">{metric.value}</p>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${metric.color} rounded-full transition-all`}
                        style={{ width: metric.value.includes("%") ? metric.value : "63%" }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="fixed bottom-8 right-8 flex gap-4"
      >
        <button
          className="px-6 py-3 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:bg-slate-300 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg"
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
}
