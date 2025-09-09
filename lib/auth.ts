// lib/authClient.ts

// ===== Types =====
export interface User {
	id: string;
	email: string;
	role: 'user' | 'admin';
	name: string;
}

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	tokenType?: string;
	accessExpiresAt?: string; // ISO datetime
	refreshExpiresAt?: string; // ISO datetime
}

type TokenResponse = {
	access_token: string;
	access_expires_at?: string;
	refresh_token: string;
	refresh_expires_at?: string;
	token_type?: string;
};

export interface AuthState {
	user: User | null;
	tokens: AuthTokens | null;
	isLoading: boolean;
}

// ===== Config =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8080';

// ===== Error helper with HTTP status =====
export class ApiError extends Error {
	status: number;
	data: any;
	constructor(message: string, status: number, data?: any) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

// ===== Core fetch helper =====
// NOTE: no credentials: 'include' (we use Bearer tokens, not cookies).
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	const config: RequestInit = {
		// mode: 'cors', // default
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {}),
		},
	};

	const res = await fetch(url, config);

	let body: any = null;
	const text = await res.text().catch(() => '');
	if (text) {
		try {
			body = JSON.parse(text);
		} catch {
			body = text;
		}
	}

	if (!res.ok) {
		const message = (body && (body.message || body.error || body.detail)) || `HTTP ${res.status}`;
		throw new ApiError(message, res.status, body);
	}

	return body as T;
}

// ===== Token storage =====
const TOKENS_KEY = 'authTokens';

export const tokenStorage = {
	getTokens(): AuthTokens | null {
		if (typeof window === 'undefined') return null;
		const raw = localStorage.getItem(TOKENS_KEY);
		if (!raw) return null;
		try {
			return JSON.parse(raw) as AuthTokens;
		} catch {
			localStorage.removeItem(TOKENS_KEY);
			return null;
		}
	},
	setTokens(tokens: AuthTokens): void {
		if (typeof window === 'undefined') return;
		localStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
	},
	clearTokens(): void {
		if (typeof window === 'undefined') return;
		localStorage.removeItem(TOKENS_KEY);
	},
};

// ===== API surface =====
export const authAPI = {
	async login(email: string, password: string): Promise<AuthTokens> {
		const res = await apiCall<TokenResponse>('/auth/login', {
			method: 'POST',
			body: JSON.stringify({ email, password }),
		});
		const tokens: AuthTokens = {
			accessToken: res.access_token,
			refreshToken: res.refresh_token,
			tokenType: res.token_type,
			accessExpiresAt: res.access_expires_at,
			refreshExpiresAt: res.refresh_expires_at,
		};
		tokenStorage.setTokens(tokens);
		return tokens;
	},

	async register(email: string, password: string, name: string): Promise<AuthTokens> {
		const res = await apiCall<TokenResponse>('/auth/register', {
			method: 'POST',
			body: JSON.stringify({ email, password, name }),
		});
		const tokens: AuthTokens = {
			accessToken: res.access_token,
			refreshToken: res.refresh_token,
			tokenType: res.token_type,
			accessExpiresAt: res.access_expires_at,
			refreshExpiresAt: res.refresh_expires_at,
		};
		tokenStorage.setTokens(tokens);
		return tokens;
	},

	async refreshToken(refreshToken: string): Promise<AuthTokens> {
		const res = await apiCall<TokenResponse>('/auth/refresh', {
			method: 'POST',
			body: JSON.stringify({ refreshToken }),
		});
		return {
			accessToken: res.access_token,
			refreshToken: res.refresh_token,
			tokenType: res.token_type,
			accessExpiresAt: res.access_expires_at,
			refreshExpiresAt: res.refresh_expires_at,
		};
	},

	async logout(): Promise<void> {
		const tokens = tokenStorage.getTokens();
		try {
			if (tokens?.accessToken) {
				await apiCall('/auth/logout', {
					method: 'POST',
					headers: { Authorization: `Bearer ${tokens.accessToken}` },
				});
			}
		} finally {
			tokenStorage.clearTokens();
		}
	},

	async getProfile(): Promise<User> {
		const tokens = tokenStorage.getTokens();
		if (!tokens?.accessToken) throw new Error('No access token available');
		return apiCall<User>('/auth/profile', {
			method: 'GET',
			headers: { Authorization: `Bearer ${tokens.accessToken}` },
		});
	},
};

// ===== Authenticated call with auto-refresh =====
export async function authFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	let tokens = tokenStorage.getTokens();
	if (!tokens) throw new Error('No authentication tokens available');

	const call = (bearer: string) =>
		apiCall<T>(endpoint, {
			...options,
			headers: {
				...(options.headers || {}),
				Authorization: `Bearer ${bearer}`,
			},
		});

	try {
		return await call(tokens.accessToken);
	} catch (err) {
		// Only attempt refresh on 401
		if (err instanceof ApiError && err.status === 401) {
			try {
				const newTokens = await authAPI.refreshToken(tokens.refreshToken);
				tokenStorage.setTokens(newTokens);
				return await call(newTokens.accessToken);
			} catch {
				tokenStorage.clearTokens();
				throw new Error('Session expired. Please login again.');
			}
		}
		throw err;
	}
}

// ===== Convenience: login then fetch profile =====
export async function loginAndLoadUser(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
	const tokens = await authAPI.login(email, password);
	const user = await authAPI.getProfile();
	return { user, tokens };
}
