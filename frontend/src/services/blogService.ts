import { apiRequest } from './apiClient'

export type BlogPost = {
	id: string
	slug: string
	title: string
	excerpt: string
	content: string
	coverImageUrl?: string
	published: boolean
	publishedAt: string | null
	createdAt: string
	updatedAt: string
}

export type BlogPostInput = {
	title: string
	excerpt: string
	content: string
	coverImageUrl?: string
	published?: boolean
}

export type BlogListResponse = {
	items: BlogPost[]
}

export type BlogItemResponse = {
	item: BlogPost
}

export async function listBlogPosts(): Promise<BlogPost[]> {
	const response = await apiRequest<BlogListResponse>('/api/blog')
	return response.items
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost> {
	const response = await apiRequest<BlogItemResponse>(`/api/blog/${slug}`)
	return response.item
}

export async function createBlogPost(payload: BlogPostInput): Promise<BlogPost> {
	const response = await apiRequest<BlogItemResponse>('/api/blog', {
		method: 'POST',
		json: payload,
	})

	return response.item
}

export async function updateBlogPost(id: string, payload: Partial<BlogPostInput> & { published?: boolean }): Promise<BlogPost> {
	const response = await apiRequest<BlogItemResponse>(`/api/blog/${id}`, {
		method: 'PUT',
		json: payload,
	})

	return response.item
}

export async function deleteBlogPost(id: string): Promise<BlogPost> {
	const response = await apiRequest<BlogItemResponse>(`/api/blog/${id}`, {
		method: 'DELETE',
	})

	return response.item
}
