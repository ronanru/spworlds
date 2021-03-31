import { writable } from 'svelte/store';

export interface AuthData {
  isAdmin: boolean;
  token: string;
}

export default writable<AuthData | null>(null);
