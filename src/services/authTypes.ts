export type AuthProvider = "guest" | "google" | "apple" | "steam";

export interface LinkedAccount {
  provider: AuthProvider;
  providerUserId: string;
  email?: string;
  linkedAt: string;
}

export interface PlayerAccount {
  playerId: string;
  displayName: string;
  provider: AuthProvider;
  isGuest: boolean;
  isSsoLoggedIn: boolean;
  email?: string;
  avatarUrl?: string;
  useSsoPhotoInRanking?: boolean;
  createdAt: string;
  lastLoginAt: string;
  deviceId?: string;
  linkedProviders: LinkedAccount[];
}

export interface AuthSession {
  playerId: string;
  provider: AuthProvider;
  accessToken?: string;
  idToken?: string;
  expiresAt?: string;
  isSecurelyStored: boolean;
}
