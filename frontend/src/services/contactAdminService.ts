import { apiRequest } from './apiClient'
import { getStoredAdminToken } from './authService'

export type ContactMessageRecord = {
	id: string
	name: string
	email: string
	subject: string
	message: string
	attachment: string
	attachmentName: string
	attachmentType: string
	createdAt: string
}

type ContactMessageListResponse = {
	items: ContactMessageRecord[]
}

function getAdminHeaders() {
	const token = getStoredAdminToken()

	if (!token) {
		throw new Error('Not authenticated')
	}

	return {
		Authorization: `Bearer ${token}`,
	}
}

export async function listContactMessages(): Promise<ContactMessageRecord[]> {
	const response = await apiRequest<ContactMessageListResponse>('/api/contact', {
		headers: getAdminHeaders(),
	})

	return response.items
}