export interface Business {
  id: string;
  name: string;
  isOnboardingCompleted?: boolean;
  [key: string]: unknown;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  image: string | null;
  businesses?: Business[];
  businessId?: string | null;
  [key: string]: unknown;
}

export interface AuthResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
  };
}

export const ADMIN_DASHBOARD = "/dashboard/admin";
export const USER_DASHBOARD = "/dashboard"; // <- change if your user dashboard URL differs
export const ONBOARDING = "/onboarding";

export function getErrorMessage(err: unknown, fallback: string) {
  const e = err as { data?: { message?: string }; message?: string };
  return e?.data?.message || e?.message || fallback;
}

/** Reads the role claim from the JWT (fallback if user.role is missing) */
function getRoleFromToken(token: string): string | undefined {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload))?.role;
  } catch {
    return undefined;
  }
}

export function getRedirectPath(user: AuthUser, accessToken: string): string {
  const role = String(user.role ?? getRoleFromToken(accessToken) ?? "")
    .trim()
    .toLowerCase();

  if (role === "admin") return ADMIN_DASHBOARD;

  const hasBusiness =
    Array.isArray(user.businesses) && user.businesses.length > 0;
  return hasBusiness ? USER_DASHBOARD : ONBOARDING;
}
