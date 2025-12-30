// intentlink\lib\utils.ts

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Calculate unlock status and countdown for locked staking positions
 * @param unlockTime Unix timestamp of unlock time
 * @returns Object with lock status, days remaining, and display message
 */
export function calculateUnlockStatus(unlockTime?: number): {
  isLocked: boolean;
  daysRemaining: number;
  message: string;
} {
  if (!unlockTime) {
    return { isLocked: false, daysRemaining: 0, message: "Flexible" };
  }

  const now = Date.now() / 1000; // Convert to Unix timestamp
  const isLocked = now < unlockTime;
  const secondsRemaining = Math.max(0, unlockTime - now);
  const daysRemaining = Math.ceil(secondsRemaining / (60 * 60 * 24));

  if (!isLocked) {
    return { isLocked: false, daysRemaining: 0, message: "✅ Unlocked" };
  }

  return {
    isLocked: true,
    daysRemaining,
    message: `🔒 Locked for ${daysRemaining} day${daysRemaining !== 1 ? 's' : ''}`
  };
}
