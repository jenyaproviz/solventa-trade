import { apiRequest } from './apiClient'
import { getStoredAdminToken } from './authService'

export type Review = {
	id: string
	authorName: string
	rating: number
	message: string
	approved: boolean
	createdAt: string
	updatedAt: string
}

export type ReviewInput = {
	authorName: string
	rating: number
	message: string
	approved?: boolean
}

export type ReviewListResponse = {
	items: Review[]
}

export type ReviewItemResponse = {
	item: Review
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

export async function listApprovedReviews(): Promise<Review[]> {
	const response = await apiRequest<ReviewListResponse>('/api/reviews')
	return response.items
}

export async function listAllReviews(): Promise<Review[]> {
	const response = await apiRequest<ReviewListResponse>('/api/reviews/admin/all', {
		headers: getAdminHeaders(),
	})
	return response.items
}

export async function createReview(payload: ReviewInput): Promise<Review> {
	const response = await apiRequest<ReviewItemResponse>('/api/reviews', {
		method: 'POST',
		json: payload,
	})

	return response.item
}

export async function updateReview(id: string, payload: Partial<ReviewInput>): Promise<Review> {
	const response = await apiRequest<ReviewItemResponse>(`/api/reviews/${id}`, {
		method: 'PUT',
		headers: getAdminHeaders(),
		json: payload,
	})

	return response.item
}

export async function deleteReview(id: string): Promise<Review> {
	const response = await apiRequest<ReviewItemResponse>(`/api/reviews/${id}`, {
		method: 'DELETE',
		headers: getAdminHeaders(),
	})

	return response.item
}
