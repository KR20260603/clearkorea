import type { AppRole } from "@/lib/auth/roles";

export function canAccessAdmin(role: AppRole): boolean {
  return role === "admin" || role === "super";
}

export function canReviewQueues(role: AppRole): boolean {
  return canAccessAdmin(role);
}

export function canManageSuperSettings(role: AppRole): boolean {
  return role === "super";
}

export type AdminAction =
  | "tip.approve"
  | "tip.reject"
  | "application.approve"
  | "application.reject"
  | "application.demote"
  | "moderation.restore"
  | "moderation.remove"
  | "settings.update";

const SUPER_ONLY_ACTIONS = new Set<AdminAction>([
  "application.approve",
  "application.reject",
  "application.demote",
  "settings.update",
]);

export function authorizeAdminAction(role: AppRole, action: AdminAction): boolean {
  if (!canAccessAdmin(role)) {
    return false;
  }
  if (SUPER_ONLY_ACTIONS.has(action)) {
    return role === "super";
  }
  return true;
}
