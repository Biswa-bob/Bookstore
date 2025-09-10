import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ===== Config =====
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, '') || 'http://localhost:8080';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

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
export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
	const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

	console.log('endpoint', endpoint);

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
