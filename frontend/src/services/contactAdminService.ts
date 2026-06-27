import { apiRequest } from './apiClient'

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

export async function listContactMessages(): Promise<ContactMessageRecord[]> {
	const response = await apiRequest<ContactMessageListResponse>('/api/contact')

	return response.items
}

export async function deleteContactMessage(id: string): Promise<void> {
	await apiRequest(`/api/contact/${id}`, { method: 'DELETE' })
}