export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    username: string;
    phone: string;
    first_name: string;
    last_name: string;
    roles: string[];
  };
  sessionId: string;
  expiresAt: Date;
  refreshExpiresAt: Date;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
  isActive: boolean;
}
