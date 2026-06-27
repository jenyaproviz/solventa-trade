import { apiRequest } from './apiClient'

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

export async function listApprovedReviews(): Promise<Review[]> {
	const response = await apiRequest<ReviewListResponse>('/api/reviews')
	return response.items
}

export async function listAllReviews(): Promise<Review[]> {
	const response = await apiRequest<ReviewListResponse>('/api/reviews/admin/all')
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
		json: payload,
	})

	return response.item
}

export async function deleteReview(id: string): Promise<Review> {
	const response = await apiRequest<ReviewItemResponse>(`/api/reviews/${id}`, {
		method: 'DELETE',
	})

	return response.item
}
