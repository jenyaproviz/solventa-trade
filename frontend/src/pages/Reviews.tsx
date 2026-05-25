import { useEffect, useMemo, useState, type FormEvent } from "react"
import { Star } from "lucide-react"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import Button from "../components/ui/Button"
import { createReview, listApprovedReviews, type Review, type ReviewInput } from "../services/reviewsService"

function RatingStars({ rating }: { rating: number }) {
	return (
		<div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
			{Array.from({ length: 5 }, (_, index) => (
				<Star
					key={index}
					className={[
						"h-4 w-4",
						index < rating ? "fill-orange-400 text-orange-400" : "text-slate-300",
					].join(" ")}
				/>
			))}
		</div>
	)
}

export default function Reviews() {
	const [reviews, setReviews] = useState<Review[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [submitError, setSubmitError] = useState("")
	const [submitSuccess, setSubmitSuccess] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [reviewForm, setReviewForm] = useState<ReviewInput>({
		authorName: "",
		rating: 5,
		message: "",
	})

	useEffect(() => {
		let isMounted = true

		async function loadReviews() {
			try {
				const reviewData = await listApprovedReviews()
				if (!isMounted) return
				setReviews(reviewData)
			} catch (loadError) {
				if (!isMounted) return
				setError(loadError instanceof Error ? loadError.message : "Failed to load reviews")
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadReviews()

		return () => {
			isMounted = false
		}
	}, [])

	const regularReviews = useMemo(() => reviews, [reviews])
	const averageRating = useMemo(() => {
		if (reviews.length === 0) return 0
		return reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
	}, [reviews])

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setSubmitError("")
		setSubmitSuccess("")

		try {
			const createdReview = await createReview(reviewForm)
			setReviewForm({ authorName: "", rating: 5, message: "" })
			setSubmitSuccess("Your review is now live.")
			setReviews((current) => [createdReview, ...current])
		} catch (submitError) {
			setSubmitError(submitError instanceof Error ? submitError.message : "Failed to submit review")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<PageSectionLayout title="Client Reviews" theme="slate">
			<div className="mt-8 space-y-8">
				{loading ? (
					<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 text-slate-600 shadow-sm">
						Loading reviews...
					</div>
				) : error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
						{error}
					</div>
				) : null}

				{reviews.length > 0 ? (
					<>
						<div className="grid gap-4 sm:grid-cols-3">
							<div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Average Rating</p>
								<div className="mt-2 flex items-end gap-3">
									<p className="text-3xl font-bold text-[#0c3b67]">{averageRating.toFixed(1)}</p>
									<RatingStars rating={Math.round(averageRating)} />
								</div>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Projects Supported</p>
								<p className="mt-2 text-3xl font-bold text-[#0c3b67]">{reviews.length}+</p>
							</div>
							<div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm">
								<p className="text-sm font-semibold text-slate-600">Long-term Clients</p>
								<p className="mt-2 text-3xl font-bold text-[#0c3b67]">{Math.min(100, reviews.filter((review) => review.rating >= 5).length * 25)}%</p>
							</div>
						</div>

						<div className="grid gap-5 md:grid-cols-2">
							<aside className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
								<h3 className="text-xl font-bold text-[#0c3b67]">Add a Review</h3>
								<p className="mt-3 text-sm leading-relaxed text-slate-700">
									Share your experience with Solventa. New reviews are published immediately.
								</p>
								<form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-3">
									<label className="block text-sm font-semibold text-slate-700">Your name</label>
									<input
										required
										value={reviewForm.authorName}
										onChange={(e) => setReviewForm((current) => ({ ...current, authorName: e.target.value }))}
										placeholder="Your name"
										className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
									<label className="block text-sm font-semibold text-slate-700">Rating</label>
									<input
										type="number"
										min={1}
										max={5}
										required
										value={reviewForm.rating}
										onChange={(e) => setReviewForm((current) => ({ ...current, rating: Number(e.target.value) }))}
										className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
									<label className="block text-sm font-semibold text-slate-700">Your review</label>
									<textarea
										required
										rows={5}
										value={reviewForm.message}
										onChange={(e) => setReviewForm((current) => ({ ...current, message: e.target.value }))}
										placeholder="Tell us about your experience"
										className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
									/>
									{submitError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p> : null}
									{submitSuccess ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{submitSuccess}</p> : null}
									<Button type="submit" fullWidth className="mt-auto" disabled={isSubmitting}>
										{isSubmitting ? "Submitting..." : "Submit Review"}
									</Button>
								</form>
							</aside>
							{regularReviews.map((item) => (
								<article key={item.id} className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
									<RatingStars rating={item.rating} />
									<p className="mt-3 text-sm leading-relaxed text-slate-700">"{item.message}"</p>
									<div className="mt-4 border-t border-slate-200 pt-4">
										<p className="font-semibold text-[#0c3b67]">{item.authorName}</p>
										<p className="text-sm text-slate-600">Approved review from the backend</p>
										<p className="mt-1 text-xs uppercase tracking-wide text-slate-500">Submitted {new Intl.DateTimeFormat("en", { month: "short", year: "numeric" }).format(new Date(item.createdAt))}</p>
									</div>
								</article>
							))}
						</div>
					</>
				) : (
					<div className="grid gap-5 md:grid-cols-2">
						<aside className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white/85 p-6 shadow-sm">
							<h3 className="text-xl font-bold text-[#0c3b67]">Add a Review</h3>
							<p className="mt-3 text-sm leading-relaxed text-slate-700">
								Share your experience with Solventa. New reviews are published immediately.
							</p>
							<form onSubmit={handleSubmit} className="mt-5 flex flex-1 flex-col gap-3">
								<label className="block text-sm font-semibold text-slate-700">Your name</label>
								<input
									required
									value={reviewForm.authorName}
									onChange={(e) => setReviewForm((current) => ({ ...current, authorName: e.target.value }))}
									placeholder="Your name"
									className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
								<label className="block text-sm font-semibold text-slate-700">Rating</label>
								<input
									type="number"
									min={1}
									max={5}
									required
									value={reviewForm.rating}
									onChange={(e) => setReviewForm((current) => ({ ...current, rating: Number(e.target.value) }))}
									className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
								<label className="block text-sm font-semibold text-slate-700">Your review</label>
								<textarea
									required
									rows={5}
									value={reviewForm.message}
									onChange={(e) => setReviewForm((current) => ({ ...current, message: e.target.value }))}
									placeholder="Tell us about your experience"
									className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
								/>
								{submitError ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{submitError}</p> : null}
								{submitSuccess ? <p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">{submitSuccess}</p> : null}
								<Button type="submit" fullWidth className="mt-auto" disabled={isSubmitting}>
									{isSubmitting ? "Submitting..." : "Submit Review"}
								</Button>
							</form>
						</aside>
					</div>
				)}
			</div>
		</PageSectionLayout>
	)
}
