import { apiRequest } from './apiClient'
import type { BlogPost } from './blogService'
import type { Review } from './reviewsService'
import type { AdminContentItem } from './adminContentService'

export type DashboardSummary = {
	blog: {
		total: number
		published: number
		drafts: number
		recent: BlogPost[]
	}
	reviews: {
		total: number
		approved: number
		pending: number
		recent: Review[]
	}
	content: {
		total: number
		recent: AdminContentItem[]
	}
}

export async function fetchDashboardSummary(): Promise<DashboardSummary> {
	return apiRequest<DashboardSummary>('/api/dashboard/summary')
}