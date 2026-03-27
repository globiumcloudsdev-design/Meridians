import { API_LOGIN, API_PROFILE } from '@/lib/api/endpoints';

export async function login(email: string, password: string) {
  const res = await fetch(API_LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  return data;
}

export async function getProfile(token: string) {
  const res = await fetch(API_PROFILE, {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch profile');
  return data.user;
}
