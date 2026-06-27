import { apiRequest } from './apiClient'

export type AdminUser = {
	email: string
	displayName: string
	role?: 'admin' | 'user'
}

export type LoginPayload = {
	email: string
	password: string
}

export type SignUpPayload = {
	email: string
	password: string
	displayName: string
}

export type LoginResponse = {
	admin: AdminUser
}

const ADMIN_USER_KEY = 'solventa_admin_user'
export const AUTH_CHANGED_EVENT = 'solventa-auth-changed'

function notifyAuthChanged() {
	if (typeof window !== 'undefined') {
		window.dispatchEvent(new Event(AUTH_CHANGED_EVENT))
	}
}

export function getStoredAdminUser(): AdminUser | null {
	const rawUser = localStorage.getItem(ADMIN_USER_KEY)
	if (!rawUser) return null

	try {
		return JSON.parse(rawUser) as AdminUser
	} catch {
		return null
	}
}

export function saveAdminSession(response: LoginResponse) {
	localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.admin))
	notifyAuthChanged()
}

export function clearAdminSession() {
	localStorage.removeItem(ADMIN_USER_KEY)
	notifyAuthChanged()
}

export async function logoutAdmin() {
	try {
		await apiRequest<{ ok: boolean }>('/api/auth/logout', {
			method: 'POST',
		})
	} finally {
		clearAdminSession()
	}
}

export async function loginAdmin(payload: LoginPayload): Promise<LoginResponse> {
	const response = await apiRequest<LoginResponse>('/api/auth/login', {
		method: 'POST',
		json: payload,
	})

	saveAdminSession(response)
	return response
}

export async function signUpUser(payload: SignUpPayload): Promise<LoginResponse> {
	const response = await apiRequest<LoginResponse>('/api/auth/signup', {
		method: 'POST',
		json: payload,
	})

	saveAdminSession(response)
	return response
}

export async function fetchAuthenticatedAdmin(): Promise<AdminUser> {
	const response = await apiRequest<{ authenticated: true; admin: AdminUser }>('/api/auth/me', {
		method: 'GET',
	})

	if (response.admin) {
		localStorage.setItem(ADMIN_USER_KEY, JSON.stringify(response.admin))
	}

	return response.admin
}
