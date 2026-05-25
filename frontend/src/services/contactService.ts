export type ContactMessagePayload = {
	name: string
	email: string
	subject: string
	message: string
	website?: string
	file?: File | null
	// base64 fields used for backend path
	attachment?: string
	attachmentName?: string
	attachmentType?: string
}

export type ContactMessageResponse = {
	ok: boolean
	saved: boolean
	delivered: boolean
	message: string
}

import { apiRequest } from './apiClient'

const FORMSPREE_CONTACT = import.meta.env.VITE_FORMSPREE_CONTACT_ENDPOINT as string | undefined

export async function sendContactMessage(payload: ContactMessagePayload): Promise<ContactMessageResponse> {
	if (FORMSPREE_CONTACT) {
		const form = new FormData()
		form.append('name', payload.name)
		form.append('email', payload.email)
		form.append('_subject', payload.subject || 'Contact from Solventa website')
		form.append('message', payload.message)
		if (payload.file) form.append('attachment', payload.file)

		const res = await fetch(FORMSPREE_CONTACT, {
			method: 'POST',
			body: form,
			headers: { Accept: 'application/json' },
		})
		if (!res.ok) {
			const data = await res.json().catch(() => ({}))
			throw new Error((data as { error?: string }).error ?? 'Failed to send message.')
		}
		return {
			ok: true,
			saved: true,
			delivered: true,
			message: 'Contact message sent successfully.',
		}
	}

	return apiRequest<ContactMessageResponse>('/api/contact', {
		method: 'POST',
		json: {
			name: payload.name,
			email: payload.email,
			subject: payload.subject || 'Contact from Solventa website',
			message: payload.message,
			website: payload.website ?? '',
			attachment: payload.attachment ?? '',
			attachmentName: payload.attachmentName ?? '',
			attachmentType: payload.attachmentType ?? '',
		},
	})
}

