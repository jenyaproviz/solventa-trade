type SubscriptionResponse = {
	ok: boolean
	message: string
}

const FORMSPREE_SUBSCRIPTION_ENDPOINT =
	import.meta.env.VITE_FORMSPREE_SUBSCRIBE_ENDPOINT ??
	"https://formspree.io/f/xvzljzpp"

export async function subscribeToNewsletter(email: string): Promise<SubscriptionResponse> {
	const response = await fetch(FORMSPREE_SUBSCRIPTION_ENDPOINT, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			subject: "Newsletter subscription",
			message: `New subscription request: ${email}`,
		}),
	})

	if (!response.ok) {
		throw new Error("Failed to subscribe. Please try again.")
	}

	return {
		ok: true,
		message: "Subscription successful. Thank you!",
	}
}