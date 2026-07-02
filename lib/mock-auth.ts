const SESSION_KEY = 'baseerah_auth';

export const DEMO_USER = 'admin';
export const DEMO_PASS = 'admin';

export function mockLogin(username: string, password: string): boolean {
  if (username === DEMO_USER && password === DEMO_PASS) {
    sessionStorage.setItem(SESSION_KEY, 'true');
    return true;
  }
  return false;
}

export function mockLogout(): void {
  sessionStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(SESSION_KEY) === 'true';
}
