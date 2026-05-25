import { useEffect, useMemo, useState } from "react"
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react"
import { Link, useParams } from "react-router-dom"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import { getBlogPostBySlug, type BlogPost } from "../services/blogService"

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

export default function BlogPostPage() {
	const { slug } = useParams<{ slug: string }>()
	const [post, setPost] = useState<BlogPost | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		let isMounted = true

		async function loadPost() {
			if (!slug) {
				setError("Invalid post URL.")
				setLoading(false)
				return
			}

			try {
				const data = await getBlogPostBySlug(slug)
				if (!isMounted) return
				setPost(data)
			} catch (loadError) {
				if (!isMounted) return
				setError(loadError instanceof Error ? loadError.message : "Failed to load post")
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		loadPost()

		return () => {
			isMounted = false
		}
	}, [slug])

	const readTime = useMemo(() => (post ? getReadTime(post.content) : "1 min read"), [post])
	const publishedDate = useMemo(() => (post ? formatDate(post.publishedAt ?? post.createdAt) : ""), [post])

	return (
		<PageSectionLayout title="Blog Post" theme="amber">
			<div className="mt-8 space-y-6">
				<Link
					to="/blog"
					className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white/85 px-4 py-2 text-sm font-semibold text-[#0c3b67] transition hover:bg-slate-50"
				>
					<ArrowLeft className="h-4 w-4" />
					Back to Blog
				</Link>

				{loading ? (
					<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 text-slate-600 shadow-sm">
						Loading article...
					</div>
				) : error ? (
					<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
						{error}
					</div>
				) : post ? (
					<article className="rounded-2xl border border-orange-200/70 bg-white/90 p-6 shadow-sm md:p-8">
						<div className="space-y-4">
							<h2 className="text-3xl font-bold text-[#0c3b67]">{post.title}</h2>
							<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
								<span className="inline-flex items-center gap-1.5">
									<CalendarDays className="h-4 w-4 text-orange-500" />
									{publishedDate}
								</span>
								<span className="inline-flex items-center gap-1.5">
									<Clock3 className="h-4 w-4 text-orange-500" />
									{readTime}
								</span>
							</div>
							<p className="text-lg text-slate-700">{post.excerpt}</p>
						</div>

						<div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white/70">
							{post.coverImageUrl ? (
								<img src={post.coverImageUrl} alt={post.title} className="h-[340px] w-full object-cover" />
							) : (
								<div className="flex h-[340px] items-center justify-center bg-gradient-to-br from-orange-100 to-slate-100 text-sm font-semibold text-slate-600">
									No preview image
								</div>
							)}
						</div>

						<div className="mt-6 whitespace-pre-line text-base leading-relaxed text-slate-700">
							{post.content}
						</div>
					</article>
				) : null}
			</div>
		</PageSectionLayout>
	)
}
