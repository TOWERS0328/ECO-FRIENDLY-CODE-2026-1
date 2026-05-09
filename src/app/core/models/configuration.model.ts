// ══════════════════════════════════════════════════════════
// Configuration Models - EcoFriendly Code
// ══════════════════════════════════════════════════════════

// ── User Settings ──────────────────────────────────────
export interface UserSettings {
  userId: string;
  theme: 'light' | 'dark';
  language: string;
  notifications: NotificationPreferences;
  privacy: PrivacySettings;
  createdAt: string;
  updatedAt: string;
}

// ── Notification Preferences ──────────────────────────
export interface NotificationPreferences {
  recyclingApproved: boolean;
  newRewards: boolean;
  weeklyReport: boolean;
  systemUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
}

// ── Privacy Settings ───────────────────────────────────
export interface PrivacySettings {
  showProfile: boolean;
  showRanking: boolean;
  showActivity: boolean;
}

// ── User Profile Info (para edición de perfil) ────────
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  university: string;
  career: string;
  semester: number;
  profileImage?: string;
  phone?: string;
  bio?: string;
}

// ── Change Password Request ───────────────────────────
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// ── Notification Item (para template) ─────────────────
export interface NotificationItem {
  id: keyof NotificationPreferences;
  title: string;
  description: string;
  enabled: boolean;
}

// ── Language Option ────────────────────────────────────
export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

// ── Configuration Summary ──────────────────────────────
export interface ConfigurationSummary {
  userProfile: UserProfile;
  settings: UserSettings;
  availableLanguages: LanguageOption[];
}

// ── API Response wrapper ─────────────────────────────
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

// ── Update Settings Request ───────────────────────────
export interface UpdateSettingsRequest {
  theme?: 'light' | 'dark';
  language?: string;
  notifications?: Partial<NotificationPreferences>;
  privacy?: Partial<PrivacySettings>;
}

// ── Delete Account Request ────────────────────────────
export interface DeleteAccountRequest {
  password: string;
  reason?: string;
  confirmation: boolean;
}
