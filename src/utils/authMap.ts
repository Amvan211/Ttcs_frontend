import type { User } from '../context/AuthContext';
import type { AuthResponse } from '../types/api';

function normalizeRole(r: string): User['role'] {
  const u = r?.toUpperCase();
  if (u === 'ADMIN' || u === 'PARTNER' || u === 'READER') return u;
  if (u === 'CUSTOMER') return 'READER';
  return 'READER';
}

export function authResponseToUser(a: AuthResponse): User {
  return {
    id: String(a.userId),
    name: (a.fullName && a.fullName.trim()) || a.username,
    email: a.mail ?? undefined,
    role: normalizeRole(a.roleName),
    avatar: undefined,
    avatarUrl: a.avatarUrl ?? undefined,
  };
}
