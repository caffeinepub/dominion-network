// Utility for persisting URL parameters across authentication flows
const INVITE_TOKEN_KEY = 'pending_invite_token';

export function persistInviteToken(token: string): void {
  try {
    sessionStorage.setItem(INVITE_TOKEN_KEY, token);
  } catch (error) {
    console.error('Failed to persist invite token:', error);
  }
}

export function getPersistedInviteToken(): string | null {
  try {
    return sessionStorage.getItem(INVITE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to retrieve invite token:', error);
    return null;
  }
}

export function clearPersistedInviteToken(): void {
  try {
    sessionStorage.removeItem(INVITE_TOKEN_KEY);
  } catch (error) {
    console.error('Failed to clear invite token:', error);
  }
}

// Get secret parameter from URL or environment - used by auto-generated useActor.ts
export function getSecretParameter(paramName: string): string | null {
  try {
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const urlValue = urlParams.get(paramName);
    if (urlValue) return urlValue;
    
    // Check sessionStorage
    const storedValue = sessionStorage.getItem(paramName);
    if (storedValue) return storedValue;
    
    return null;
  } catch (error) {
    console.error(`Failed to get secret parameter ${paramName}:`, error);
    return null;
  }
}
