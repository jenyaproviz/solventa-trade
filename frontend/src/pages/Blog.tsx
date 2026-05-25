import { useEffect, useMemo, useState, type FormEvent } from "react"
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react"
import { Link } from "react-router-dom"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import Button from "../components/ui/Button"
import { listBlogPosts, type BlogPost } from "../services/blogService"
import { subscribeToNewsletter } from "../services/subscriptionService"

type BlogCard = BlogPost & {
	category: string
	date: string
	readTime: string
	featured?: boolean
}

function formatDate(value: string | null) {
	if (!value) return "Recently published"
	return new Intl.DateTimeFormat("en", {
		month: "long",
		year: "numeric",
	}).format(new Date(value))
}

function getReadTime(content: string) {
	const words = content.trim().split(/\s+/).filter(Boolean).length
	return `${Math.max(1, Math.ceil(words / 180))} min read`
}

const unifiedCardClassName =
	"rounded-2xl border border-[#d0deed] bg-gradient-to-br from-white to-[#eef5ff] shadow-[0_4px_16px_rgba(12,59,103,0.08)]"

export default function Blog() {
	const [posts, setPosts] = useState<BlogCard[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")
	const [subscribeEmail, setSubscribeEmail] = useState("")
	const [subscribeError, setSubscribeError] = useState("")
	const [subscribeSuccess, setSubscribeSuccess] = useState("")
	const [isSubscribing, setIsSubscribing] = useState(false)

	useEffect(() => {
		let isMounted = true

		async function loadPosts() {
			try {
				const blogData = await listBlogPosts()
				if (!isMounted) return

				const mappedPosts = blogData.map((post, index) => ({
					...post,
					category: post.published ? "Published Insight" : "Draft",
					date: formatDate(post.publishedAt ?? post.createdAt),
					readTime: getReadTime(post.content),
					featured: index === 0,
				}))

				setPosts(mappedPosts)
			} catch (loadError) {
				if (!isMounted) return
				setError(loadError instanceof Error ? loadError.message : "Failed to load blog posts")
			} finally {
				if (isMounted) {
					setLoading(false)
				}
			}
		}

		loadPosts()

		return () => {
			isMounted = false
		}
	}, [])

	const featuredPost = useMemo(() => posts.find((post) => post.featured) ?? posts[0], [posts])
	const regularPosts = useMemo(() => posts.filter((post) => post !== featuredPost), [posts, featuredPost])

	async function handleSubscribe(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubscribing(true)
		setSubscribeError("")
		setSubscribeSuccess("")

		try {
			const response = await subscribeToNewsletter(subscribeEmail)
			setSubscribeSuccess(response.message)
			setSubscribeEmail("")
		} catch (subscribeFailure) {
			setSubscribeError(subscribeFailure instanceof Error ? subscribeFailure.message : "Failed to subscribe")
		} finally {
			setIsSubscribing(false)
		}
	}

	return (
		<PageSectionLayout title="Blog" theme="slate">
			<div className="mt-8 space-y-8">
				{loading ? (
					<div className={`${unifiedCardClassName} p-6 text-slate-600`}>
						Loading blog posts...
					</div>
				) : error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
						{error}
					</div>
				) : null}

				{!loading && !error && posts.length > 0 && (
					<>
						<article className={`group relative overflow-hidden ${unifiedCardClassName} p-6 md:p-8`}>
							<div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-orange-200/30 blur-2xl" />
							<div className="relative z-10 grid gap-6 md:grid-cols-[1.1fr_1fr] md:items-start">
								<div className="overflow-hidden rounded-2xl border border-orange-200/70 bg-white/70">
									{featuredPost?.coverImageUrl ? (
										<img
											src={featuredPost.coverImageUrl}
											alt={featuredPost.title}
											className="h-64 w-full object-cover"
										/>
									) : (
										<div className="flex h-64 items-center justify-center bg-gradient-to-br from-orange-100 to-slate-100 text-sm font-semibold text-slate-600">
											No preview image
										</div>
									)}
								</div>
								<div className="max-w-3xl space-y-4">
									<span className="inline-flex rounded-full border border-orange-300 bg-orange-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-orange-700">
										Featured Insight
									</span>
									<h2 className="text-2xl font-bold leading-tight text-[#0c3b67] md:text-3xl">
										{featuredPost?.title}
									</h2>
									<p className="text-base leading-relaxed text-slate-700">{featuredPost?.excerpt}</p>
									<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
										<span className="inline-flex items-center gap-1.5">
											<CalendarDays className="h-4 w-4 text-orange-500" />
											{featuredPost?.date}
										</span>
										<span className="inline-flex items-center gap-1.5">
											<Clock3 className="h-4 w-4 text-orange-500" />
											{featuredPost?.readTime}
										</span>
										<span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700">
											{featuredPost?.category}
										</span>
									</div>
									{featuredPost ? (
										<Link
											to={`/blog/${featuredPost.slug}`}
											className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600"
										>
											Read article
											<ArrowRight className="h-4 w-4" />
										</Link>
									) : null}
								</div>
							</div>
						</article>

						<div className="grid gap-5 md:grid-cols-2">
							{regularPosts.map((post) => (
								<article
									key={post.id}
									className={`group ${unifiedCardClassName} p-5 transition hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-[0_10px_24px_rgba(12,59,103,0.14)]`}
								>
									<div className="overflow-hidden rounded-xl border border-slate-200 bg-white/70">
										{post.coverImageUrl ? (
											<img src={post.coverImageUrl} alt={post.title} className="h-44 w-full object-cover" />
										) : (
											<div className="flex h-44 items-center justify-center bg-gradient-to-br from-orange-100 to-slate-100 text-sm font-semibold text-slate-600">
												No preview image
											</div>
										)}
									</div>
									<span className="mt-4 inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700">
										{post.category}
									</span>
									<h3 className="mt-3 text-lg font-bold leading-snug text-[#0c3b67] transition group-hover:text-[#1f5c92]">
										{post.title}
									</h3>
									<p className="mt-2 text-sm leading-relaxed text-slate-700">{post.excerpt}</p>
									<div className="mt-4 flex items-center justify-between text-xs text-slate-500">
										<span className="inline-flex items-center gap-1.5">
											<CalendarDays className="h-3.5 w-3.5 text-orange-500" />
											{post.date}
										</span>
										<span className="inline-flex items-center gap-1.5">
											<Clock3 className="h-3.5 w-3.5 text-orange-500" />
											{post.readTime}
										</span>
									</div>
									<Link
										to={`/blog/${post.slug}`}
										className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-orange-600"
									>
										Read article
										<ArrowRight className="h-4 w-4" />
									</Link>
								</article>
							))}
						</div>
					</>
				)}

				{!loading && !error && posts.length === 0 && (
					<div className={`${unifiedCardClassName} p-6 text-slate-600`}>
						No blog posts are published yet.
					</div>
				)}

				<aside className={`flex h-full max-w-2xl flex-col ${unifiedCardClassName} p-6`}>
					<h3 className="text-xl font-bold text-[#0c3b67]">Stay Updated</h3>
					<p className="mt-3 text-sm leading-relaxed text-slate-700">
						Get practical trade tips, market updates, and short checklists from our team.
					</p>
					<form onSubmit={handleSubscribe} className="mt-5 flex flex-1 flex-col gap-3">
						<label className="block text-sm font-semibold text-slate-700">Email address</label>
						<input
							type="email"
							required
							value={subscribeEmail}
							onChange={(event) => setSubscribeEmail(event.target.value)}
							placeholder="you@company.com"
							className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
						/>
						{subscribeError ? (
							<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{subscribeError}
							</p>
						) : null}
						{subscribeSuccess ? (
							<p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
								{subscribeSuccess}
							</p>
						) : null}
						<Button type="submit" fullWidth className="mt-auto" disabled={isSubscribing}>
							{isSubscribing ? "Subscribing..." : "Subscribe"}
						</Button>
					</form>
				</aside>
			</div>
		</PageSectionLayout>
	)
}
