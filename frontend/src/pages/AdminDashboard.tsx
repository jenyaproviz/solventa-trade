import { useEffect, useMemo, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import SectionShell from "../components/layout/SectionShell"
import TextCard from "../components/ui/TextCard"
import InfoCard from "../components/ui/InfoCard"
import SectionHeader from "../components/ui/SectionHeader"
import {
  Clock3,
  FileText,
  PenLine,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  Trash2,
  Star,
} from "lucide-react"
import {
	clearAdminSession,
	fetchAuthenticatedAdmin,
	getStoredAdminUser,
	logoutAdmin,
	type AdminUser,
} from "../services/authService"
import Button from "../components/ui/Button"
import {
	createBlogPost,
	deleteBlogPost,
	listBlogPosts,
	updateBlogPost,
	type BlogPost,
	type BlogPostInput,
} from "../services/blogService"
import {
	createReview,
	deleteReview,
	listAllReviews,
	updateReview,
	type Review,
	type ReviewInput,
} from "../services/reviewsService"
import {
	createAdminContentItem,
	deleteAdminContentItem,
	listAdminContent,
	updateAdminContentItem,
	type AdminContentInput,
	type AdminContentItem,
} from "../services/adminContentService"
import { deleteContactMessage, listContactMessages, type ContactMessageRecord } from "../services/contactAdminService"

type StatusState = {
	loading: boolean
	error: string
}

export default function AdminDashboard() {
	const navigate = useNavigate()
	const [admin, setAdmin] = useState<AdminUser | null>(getStoredAdminUser())
	const [isCheckingAuth, setIsCheckingAuth] = useState(true)
	const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
	const [reviews, setReviews] = useState<Review[]>([])
	const [contentItems, setContentItems] = useState<AdminContentItem[]>([])
	const [contactMessages, setContactMessages] = useState<ContactMessageRecord[]>([])
	const [sessionCheckedAt, setSessionCheckedAt] = useState(() => Date.now())
	const [blogStatus, setBlogStatus] = useState<StatusState>({ loading: true, error: "" })
	const [reviewStatus, setReviewStatus] = useState<StatusState>({ loading: true, error: "" })
	const [contentStatus, setContentStatus] = useState<StatusState>({ loading: true, error: "" })
	const [contactStatus, setContactStatus] = useState<StatusState>({ loading: true, error: "" })

	const lastUpdatedLabel = useMemo(() => {
		const allTimestamps = [
			sessionCheckedAt,
			...blogPosts.map((post) => Date.parse(post.updatedAt || post.createdAt)),
			...reviews.map((review) => Date.parse(review.updatedAt || review.createdAt)),
			...contentItems.map((item) => Date.parse(item.updatedAt)),
			...contactMessages.map((item) => Date.parse(item.createdAt)),
		].filter((timestamp) => Number.isFinite(timestamp))

		const latest = allTimestamps.length > 0 ? Math.max(...allTimestamps) : sessionCheckedAt

		return new Intl.DateTimeFormat("en", {
			month: "short",
			day: "2-digit",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(latest))
	}, [blogPosts, contactMessages, contentItems, reviews, sessionCheckedAt])

	const [blogForm, setBlogForm] = useState<BlogPostInput>({
		title: "",
		excerpt: "",
		content: "",
		coverImageUrl: "",
		published: true,
	})
	const [editingBlogId, setEditingBlogId] = useState<string | null>(null)

	const [reviewForm, setReviewForm] = useState<ReviewInput>({
		authorName: "",
		rating: 5,
		message: "",
		approved: false,
	})
	const [editingReviewId, setEditingReviewId] = useState<string | null>(null)
	const [selectedContactId, setSelectedContactId] = useState<string | null>(null)

	const [contentForm, setContentForm] = useState<AdminContentInput>({
		key: "",
		title: "",
		body: "",
	})
	const [editingContentKey, setEditingContentKey] = useState<string | null>(null)

	useEffect(() => {
		let isMounted = true

		async function verifySession() {
			try {
				const authenticatedAdmin = await fetchAuthenticatedAdmin()
				if (isMounted) {
					setAdmin(authenticatedAdmin)
					setSessionCheckedAt(Date.now())
				}
			} catch {
				clearAdminSession()
				navigate("/admin/login", { replace: true })
			} finally {
				if (isMounted) {
					setIsCheckingAuth(false)
				}
			}
		}

		verifySession()

		return () => {
			isMounted = false
		}
	}, [navigate])

	useEffect(() => {
		let isMounted = true

		async function loadDashboardData() {
			try {
				const [blogData, reviewData, contentData, contactData] = await Promise.all([
					listBlogPosts(),
					listAllReviews(),
					listAdminContent(),
					listContactMessages(),
				])

				if (!isMounted) return

				setBlogPosts(blogData)
				setReviews(reviewData)
				setContentItems(contentData)
				setContactMessages(contactData)
			} catch (error) {
				const message = error instanceof Error ? error.message : "Failed to load dashboard data"
				if (!isMounted) return

				setBlogStatus((prev) => ({ ...prev, error: message }))
				setReviewStatus((prev) => ({ ...prev, error: message }))
				setContentStatus((prev) => ({ ...prev, error: message }))
				setContactStatus((prev) => ({ ...prev, error: message }))
			} finally {
				if (isMounted) {
					setBlogStatus((prev) => ({ ...prev, loading: false }))
					setReviewStatus((prev) => ({ ...prev, loading: false }))
					setContentStatus((prev) => ({ ...prev, loading: false }))
					setContactStatus((prev) => ({ ...prev, loading: false }))
				}
			}
		}

		loadDashboardData()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		if (contactMessages.length === 0) {
			setSelectedContactId(null)
			return
		}

		setSelectedContactId((current) => {
			if (current && contactMessages.some((item) => item.id === current)) {
				return current
			}

			return contactMessages[0]?.id ?? null
		})
	}, [contactMessages])

	async function handleLogout() {
		await logoutAdmin()
		navigate("/admin/login", { replace: true })
	}

	function resetBlogForm() {
		setBlogForm({
			title: "",
			excerpt: "",
			content: "",
			coverImageUrl: "",
			published: true,
		})
		setEditingBlogId(null)
	}

	function resetReviewForm() {
		setReviewForm({
			authorName: "",
			rating: 5,
			message: "",
			approved: false,
		})
		setEditingReviewId(null)
	}

	function resetContentForm() {
		setContentForm({
			key: "",
			title: "",
			body: "",
		})
		setEditingContentKey(null)
	}

	async function handleBlogSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		try {
			if (editingBlogId) {
				const updated = await updateBlogPost(editingBlogId, blogForm)
				setBlogPosts((current) => current.map((item) => (item.id === updated.id ? updated : item)))
			} else {
				const created = await createBlogPost(blogForm)
				setBlogPosts((current) => [created, ...current])
			}
			resetBlogForm()
		} catch (error) {
			setBlogStatus((prev) => ({
				...prev,
				error: error instanceof Error ? error.message : "Failed to save blog post",
			}))
		}
	}

	async function handleReviewSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		try {
			if (editingReviewId) {
				const updated = await updateReview(editingReviewId, reviewForm)
				setReviews((current) => current.map((item) => (item.id === updated.id ? updated : item)))
			} else {
				const created = await createReview(reviewForm)
				setReviews((current) => [created, ...current])
			}
			resetReviewForm()
		} catch (error) {
			setReviewStatus((prev) => ({
				...prev,
				error: error instanceof Error ? error.message : "Failed to save review",
			}))
		}
	}

	async function handleContentSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		try {
			if (editingContentKey) {
				const updated = await updateAdminContentItem(editingContentKey, {
					title: contentForm.title,
					body: contentForm.body,
				})
				setContentItems((current) => current.map((item) => (item.key === updated.key ? updated : item)))
			} else {
				const created = await createAdminContentItem(contentForm)
				setContentItems((current) => [created, ...current])
			}
			resetContentForm()
		} catch (error) {
			setContentStatus((prev) => ({
				...prev,
				error: error instanceof Error ? error.message : "Failed to save content item",
			}))
		}
	}

	async function handleDeleteBlog(post: BlogPost) {
		await deleteBlogPost(post.id)
		setBlogPosts((current) => current.filter((item) => item.id !== post.id))
		if (editingBlogId === post.id) {
			resetBlogForm()
		}
	}

	async function handleDeleteReview(review: Review) {
		await deleteReview(review.id)
		setReviews((current) => current.filter((item) => item.id !== review.id))
		if (editingReviewId === review.id) {
			resetReviewForm()
		}
	}

	async function handleDeleteContact(message: ContactMessageRecord) {
		await deleteContactMessage(message.id)
		setContactMessages((current) => current.filter((item) => item.id !== message.id))
	}

	async function handleDeleteContent(item: AdminContentItem) {
		await deleteAdminContentItem(item.key)
		setContentItems((current) => current.filter((entry) => entry.key !== item.key))
		if (editingContentKey === item.key) {
			resetContentForm()
		}
	}

	function beginBlogEdit(post: BlogPost) {
		setEditingBlogId(post.id)
		setBlogForm({
			title: post.title,
			excerpt: post.excerpt,
			content: post.content,
			coverImageUrl: post.coverImageUrl ?? "",
			published: post.published,
		})
	}

	function beginReviewEdit(review: Review) {
		setEditingReviewId(review.id)
		setReviewForm({
			authorName: review.authorName,
			rating: review.rating,
			message: review.message,
			approved: review.approved,
		})
	}

	function beginContentEdit(item: AdminContentItem) {
		setEditingContentKey(item.key)
		setContentForm({
			key: item.key,
			title: item.title,
			body: item.body,
		})
	}

	const selectedContactMessage = contactMessages.find((item) => item.id === selectedContactId) ?? null

	if (isCheckingAuth) {
		return (
			<PageSectionLayout title="Admin Dashboard" theme="slate">
				<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 text-slate-600 shadow-sm">
					Checking admin session...
				</div>
			</PageSectionLayout>
		)
	}

	return (
		<PageSectionLayout title="Admin Dashboard" theme="slate">
			<div className="space-y-8">
				<SectionShell className="border-[#c9dcf1] bg-gradient-to-r from-[#edf5ff] via-white to-[#fff4e8] !py-6 shadow-[0_8px_24px_rgba(12,59,103,0.08)]">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-sm font-semibold uppercase tracking-wide text-[#1f5c92]">
								Admin Workspace
							</p>
							<h2 className="mt-2 text-2xl font-bold text-[#0c3b67] md:text-3xl">
								Manage Content, Reviews, and Site Operations
							</h2>
							<p className="mt-2 text-sm text-slate-600">
								Signed in as {admin?.displayName ?? 'Solventa Admin'} ({admin?.email ?? 'unknown'})
							</p>
						</div>
						<div className="flex flex-wrap items-center gap-3">
							<div className="rounded-xl border border-slate-200 bg-white/85 px-4 py-2 text-sm text-slate-700">
								<div className="flex items-center gap-3">
								<Clock3 className="h-4 w-4 text-[#1f5c92]" />
								<span>Authenticated session active</span>
								</div>
								<p className="mt-1 text-xs text-slate-500">Last update: {lastUpdatedLabel}</p>
							</div>
							<Button type="button" variant="ghost" onClick={handleLogout} className="bg-white/80">
								Logout
							</Button>
						</div>
					</div>
				</SectionShell>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<InfoCard
						icon={FileText}
						title="Blog Posts"
						description={blogStatus.loading ? "Loading…" : `${blogPosts.length} posts loaded`}
						iconClassName="text-[#163a5b]"
						className="border-slate-200 bg-white/85 shadow-[0_6px_20px_rgba(12,59,103,0.08)]"
					/>
					<InfoCard
						icon={Star}
						title="Reviews Queue"
						description={reviewStatus.loading ? "Loading…" : `${reviews.length} reviews loaded`}
						className="border-slate-200 bg-white/85 shadow-[0_6px_20px_rgba(12,59,103,0.08)]"
					/>
					<InfoCard
						icon={MessageSquare}
						title="Contact Messages"
						description={contactStatus.loading ? "Loading…" : `${contactMessages.length} messages saved`}
						iconClassName="text-[#2a4f70]"
						className="border-slate-200 bg-white/85 shadow-[0_6px_20px_rgba(12,59,103,0.08)]"
					/>
					<InfoCard
						icon={RefreshCw}
						title="System Status"
						description="Connected to authenticated backend"
						iconClassName="text-[#163a5b]"
						className="border-slate-200 bg-white/85 shadow-[0_6px_20px_rgba(12,59,103,0.08)]"
					/>
				</div>

				<div className="grid gap-6 xl:grid-cols-2">
					<TextCard className="bg-white/85">
						<div className="flex items-center justify-between gap-4">
							<SectionHeader title="Blog Management" />
							<div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1f5c92]">
								<FileText className="h-3.5 w-3.5" />
								{blogStatus.loading ? "Loading" : `${blogPosts.length} Posts`}
							</div>
						</div>
						<form onSubmit={handleBlogSubmit} className="mt-6 grid gap-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<input className="rounded-xl border border-slate-300 px-4 py-3" value={blogForm.title} onChange={(e) => setBlogForm((current) => ({ ...current, title: e.target.value }))} placeholder="Title" />
								<input className="rounded-xl border border-slate-300 px-4 py-3" value={blogForm.coverImageUrl ?? ""} onChange={(e) => setBlogForm((current) => ({ ...current, coverImageUrl: e.target.value }))} placeholder="Cover image URL" />
							</div>
							<textarea className="rounded-xl border border-slate-300 px-4 py-3" rows={3} value={blogForm.excerpt} onChange={(e) => setBlogForm((current) => ({ ...current, excerpt: e.target.value }))} placeholder="Excerpt" />
							<textarea className="rounded-xl border border-slate-300 px-4 py-3" rows={5} value={blogForm.content} onChange={(e) => setBlogForm((current) => ({ ...current, content: e.target.value }))} placeholder="Content" />
							<label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
								<input type="checkbox" checked={Boolean(blogForm.published)} onChange={(e) => setBlogForm((current) => ({ ...current, published: e.target.checked }))} />
								Published
							</label>
							{blogStatus.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{blogStatus.error}</p> : null}
							<div className="flex flex-wrap gap-3">
								<Button type="submit" className="gap-2">
									<Plus className="h-4 w-4" />
									{editingBlogId ? "Update Post" : "Create Post"}
								</Button>
								{editingBlogId ? (
									<Button type="button" variant="ghost" onClick={resetBlogForm} className="border border-slate-200">
										Cancel
									</Button>
								) : null}
							</div>
						</form>
						<div className="mt-6 space-y-3">
							{blogPosts.map((post) => (
								<div key={post.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-semibold text-[#0c3b67]">{post.title}</p>
											<p className="mt-1 text-sm text-slate-600">{post.excerpt}</p>
											<p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{post.published ? "Published" : "Draft"} • {post.slug}</p>
										</div>
										<div className="flex gap-2">
											<Button type="button" variant="ghost" onClick={() => beginBlogEdit(post)} className="border border-slate-200 !px-3 !py-2">
												<PenLine className="h-4 w-4" />
											</Button>
											<Button type="button" variant="ghost" onClick={() => void handleDeleteBlog(post)} className="border border-slate-200 !px-3 !py-2 text-red-600 hover:text-red-700">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</TextCard>

					<TextCard className="bg-white/85">
						<div className="flex items-center justify-between gap-4">
							<SectionHeader title="Reviews Moderation" />
							<div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1f5c92]">
								<Star className="h-3.5 w-3.5" />
								{reviewStatus.loading ? "Loading" : `${reviews.length} Reviews`}
							</div>
						</div>
						<form onSubmit={handleReviewSubmit} className="mt-6 grid gap-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<input className="rounded-xl border border-slate-300 px-4 py-3" value={reviewForm.authorName} onChange={(e) => setReviewForm((current) => ({ ...current, authorName: e.target.value }))} placeholder="Author name" />
								<input className="rounded-xl border border-slate-300 px-4 py-3" type="number" min={1} max={5} value={reviewForm.rating} onChange={(e) => setReviewForm((current) => ({ ...current, rating: Number(e.target.value) }))} placeholder="Rating" />
							</div>
							<textarea className="rounded-xl border border-slate-300 px-4 py-3" rows={4} value={reviewForm.message} onChange={(e) => setReviewForm((current) => ({ ...current, message: e.target.value }))} placeholder="Review message" />
							<label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
								<input type="checkbox" checked={Boolean(reviewForm.approved)} onChange={(e) => setReviewForm((current) => ({ ...current, approved: e.target.checked }))} />
								Approved
							</label>
							{reviewStatus.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{reviewStatus.error}</p> : null}
							<div className="flex flex-wrap gap-3">
								<Button type="submit" className="gap-2">
									<Plus className="h-4 w-4" />
									{editingReviewId ? "Update Review" : "Create Review"}
								</Button>
								{editingReviewId ? (
									<Button type="button" variant="ghost" onClick={resetReviewForm} className="border border-slate-200">
										Cancel
									</Button>
								) : null}
							</div>
						</form>
						<div className="mt-6 space-y-3">
							{reviews.map((review) => (
								<div key={review.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-semibold text-[#0c3b67]">{review.authorName}</p>
											<p className="mt-1 text-sm text-slate-600">{review.message}</p>
											<p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Rating {review.rating} • {review.approved ? "Approved" : "Pending"}</p>
										</div>
										<div className="flex gap-2">
											<Button type="button" variant="ghost" onClick={() => beginReviewEdit(review)} className="border border-slate-200 !px-3 !py-2">
												<PenLine className="h-4 w-4" />
											</Button>
											<Button type="button" variant="ghost" onClick={() => void handleDeleteReview(review)} className="border border-slate-200 !px-3 !py-2 text-red-600 hover:text-red-700">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</TextCard>

					<TextCard className="bg-white/85 xl:col-span-2">
						<div className="flex items-center justify-between gap-4">
							<SectionHeader title="Contact Inbox" />
							<div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1f5c92]">
								<MessageSquare className="h-3.5 w-3.5" />
								{contactStatus.loading ? "Loading" : `${contactMessages.length} ${contactMessages.length === 1 ? "Message" : "Messages"}`}
							</div>
						</div>
						{contactStatus.error ? <p className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{contactStatus.error}</p> : null}
						<div className="mt-6 grid gap-4 xl:grid-cols-[0.95fr_1.25fr]">
							{contactMessages.length === 0 && !contactStatus.loading ? (
								<div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
									No contact messages saved yet.
								</div>
							) : null}
							{contactMessages.length > 0 ? (
								<div className="space-y-3">
									{contactMessages.map((item) => {
										const isSelected = item.id === selectedContactId
										const preview = item.message.length > 110 ? `${item.message.slice(0, 110)}...` : item.message
										const subjectClassName = isSelected ? "truncate font-semibold text-white" : "truncate font-semibold text-[#0c3b67]"
										const metaClassName = isSelected ? "mt-1 truncate text-sm text-slate-200" : "mt-1 truncate text-sm text-slate-600"
										const previewClassName = isSelected ? "mt-2 text-sm leading-6 text-slate-100" : "mt-2 text-sm leading-6 text-slate-600"
										const stampClassName = isSelected ? "shrink-0 text-right text-xs uppercase tracking-wide text-slate-200" : "shrink-0 text-right text-xs uppercase tracking-wide text-slate-500"
										const actionClassName = isSelected ? "mt-2 normal-case text-orange-200" : "mt-2 normal-case text-[#1f5c92]"

										return (
											<button
												key={item.id}
												type="button"
												onClick={() => setSelectedContactId(item.id)}
												className={`w-full rounded-2xl border p-4 text-left transition ${isSelected ? "border-[#3f6d95] bg-gradient-to-br from-[#15385a] to-[#0c2741] shadow-[0_10px_28px_rgba(12,59,103,0.22)]" : "border-slate-200 bg-white/80 hover:border-[#c9dcf1] hover:bg-[#f8fbff]"}`}
											>
												<div className="flex items-start justify-between gap-4">
													<div className="min-w-0 flex-1">
														<div className={subjectClassName}>{item.subject}</div>
														<div className={metaClassName}>{item.name} • {item.email}</div>
														<div className={previewClassName}>{preview}</div>
													</div>
													<div className={stampClassName}>
														<div>{new Intl.DateTimeFormat("en", {
															month: "short",
															day: "2-digit",
															year: "numeric",
														}).format(new Date(item.createdAt))}</div>
														<div className={actionClassName}>{isSelected ? "Open" : "Read message"}</div>
													</div>
												</div>
											</button>
										)
									})}
								</div>
							) : null}
							{selectedContactMessage ? (
								<div className="rounded-2xl border border-[#c9dcf1] bg-gradient-to-br from-[#f8fbff] via-white to-[#fff7ef] p-5 shadow-[0_10px_24px_rgba(12,59,103,0.08)]">
									<div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-4">
										<div>
											<p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f5c92]">Open Message</p>
											<h4 className="mt-2 text-2xl font-bold text-[#0c3b67]">{selectedContactMessage.subject}</h4>
											<p className="mt-2 text-sm text-slate-600">From {selectedContactMessage.name} • <a className="font-medium text-[#1f5c92] hover:underline" href={`mailto:${selectedContactMessage.email}`}>{selectedContactMessage.email}</a></p>
										</div>
										<div className="text-right text-sm text-slate-500">
											<div>{new Intl.DateTimeFormat("en", {
												month: "short",
												day: "2-digit",
												year: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											}).format(new Date(selectedContactMessage.createdAt))}</div>
											{selectedContactMessage.attachmentName ? <p className="mt-2">Attachment: {selectedContactMessage.attachmentName}</p> : null}
										</div>
									</div>
									<div className="mt-5 rounded-2xl border border-slate-200 bg-white/90 p-4">
										<p className="whitespace-pre-wrap text-sm leading-7 text-slate-700">{selectedContactMessage.message}</p>
									</div>
									<div className="mt-4 flex flex-wrap gap-3">
										<a
											href={`mailto:${selectedContactMessage.email}?subject=${encodeURIComponent(`Re: ${selectedContactMessage.subject}`)}`}
											className="inline-flex items-center rounded-lg bg-[#0c3b67] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0a3156]"
										>
											Reply by email
										</a>
										{selectedContactMessage.attachment && selectedContactMessage.attachmentName ? (
											<a
												href={`data:${selectedContactMessage.attachmentType || "application/octet-stream"};base64,${selectedContactMessage.attachment}`}
												download={selectedContactMessage.attachmentName}
												className="inline-flex items-center rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-[#0c3b67] transition hover:border-[#c9dcf1] hover:bg-[#f8fbff]"
											>
												Download attachment
											</a>
										) : null}
										<Button
											type="button"
											variant="ghost"
											onClick={() => void handleDeleteContact(selectedContactMessage)}
											className="ml-auto border border-red-200 !px-3 !py-2 text-red-600 hover:border-red-300 hover:bg-red-50 hover:text-red-700"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</div>
							) : null}
						</div>
					</TextCard>

					<TextCard className="bg-white/85 xl:col-span-2">
						<div className="flex items-center justify-between gap-4">
							<SectionHeader title="Admin Content" />
							<div className="flex items-center gap-2 rounded-lg bg-white/80 px-3 py-1.5 text-xs font-semibold text-[#1f5c92]">
								<Settings className="h-3.5 w-3.5" />
								{contentStatus.loading ? "Loading" : `${contentItems.length} Items`}
							</div>
						</div>
						<form onSubmit={handleContentSubmit} className="mt-6 grid gap-4">
							<div className="grid gap-4 sm:grid-cols-2">
								<input className="rounded-xl border border-slate-300 px-4 py-3" value={contentForm.key} onChange={(e) => setContentForm((current) => ({ ...current, key: e.target.value }))} placeholder="Key, e.g. homepage-hero" disabled={editingContentKey !== null} />
								<input className="rounded-xl border border-slate-300 px-4 py-3" value={contentForm.title} onChange={(e) => setContentForm((current) => ({ ...current, title: e.target.value }))} placeholder="Title" />
							</div>
							<textarea className="rounded-xl border border-slate-300 px-4 py-3" rows={4} value={contentForm.body} onChange={(e) => setContentForm((current) => ({ ...current, body: e.target.value }))} placeholder="Body" />
							{contentStatus.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{contentStatus.error}</p> : null}
							<div className="flex flex-wrap gap-3">
								<Button type="submit" className="gap-2">
									<Plus className="h-4 w-4" />
									{editingContentKey ? "Update Content" : "Create Content Item"}
								</Button>
								{editingContentKey ? (
									<Button type="button" variant="ghost" onClick={resetContentForm} className="border border-slate-200">
										Cancel
									</Button>
								) : null}
							</div>
						</form>
						<div className="mt-6 grid gap-3 md:grid-cols-2">
							{contentItems.map((item) => (
								<div key={item.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
									<div className="flex items-start justify-between gap-4">
										<div>
											<p className="font-semibold text-[#0c3b67]">{item.title}</p>
											<p className="mt-1 text-sm text-slate-600">{item.body}</p>
											<p className="mt-2 text-xs uppercase tracking-wide text-slate-500">Key: {item.key}</p>
										</div>
										<div className="flex gap-2">
											<Button type="button" variant="ghost" onClick={() => beginContentEdit(item)} className="border border-slate-200 !px-3 !py-2">
												<PenLine className="h-4 w-4" />
											</Button>
											<Button type="button" variant="ghost" onClick={() => void handleDeleteContent(item)} className="border border-slate-200 !px-3 !py-2 text-red-600 hover:text-red-700">
												<Trash2 className="h-4 w-4" />
											</Button>
										</div>
									</div>
								</div>
							))}
						</div>
					</TextCard>
				</div>
			</div>
		</PageSectionLayout>
	)
}
