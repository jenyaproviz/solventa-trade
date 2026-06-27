import { apiRequest } from './apiClient'

export type AdminContentItem = {
	id: string
	key: string
	title: string
	body: string
	updatedAt: string
}

export type AdminContentInput = {
	key: string
	title: string
	body: string
}

export type AdminContentListResponse = {
	items: AdminContentItem[]
}

export type AdminContentItemResponse = {
	item: AdminContentItem
}

export async function listAdminContent(): Promise<AdminContentItem[]> {
	const response = await apiRequest<AdminContentListResponse>('/api/admin/content')
	return response.items
}

export async function getAdminContentItem(key: string): Promise<AdminContentItem> {
	const response = await apiRequest<AdminContentItemResponse>(`/api/admin/content/${key}`)
	return response.item
}

export async function createAdminContentItem(payload: AdminContentInput): Promise<AdminContentItem> {
	const response = await apiRequest<AdminContentItemResponse>('/api/admin/content', {
		method: 'POST',
		json: payload,
	})

	return response.item
}

export async function updateAdminContentItem(key: string, payload: Partial<Omit<AdminContentInput, 'key'>>): Promise<AdminContentItem> {
	const response = await apiRequest<AdminContentItemResponse>(`/api/admin/content/${key}`, {
		method: 'PUT',
		json: payload,
	})

	return response.item
}

export async function deleteAdminContentItem(key: string): Promise<AdminContentItem> {
	const response = await apiRequest<AdminContentItemResponse>(`/api/admin/content/${key}`, {
		method: 'DELETE',
	})

	return response.item
}
