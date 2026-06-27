import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BarChart3, FileText, MessageSquare, Settings, Star } from "lucide-react"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import TextCard from "../components/ui/TextCard"
import Button from "../components/ui/Button"
import { clearAdminSession, fetchAuthenticatedAdmin, getStoredAdminUser, logoutAdmin, type AdminUser } from "../services/authService"
import { fetchDashboardSummary, type DashboardSummary } from "../services/dashboardService"

export default function Dashboard() {
	const navigate = useNavigate()
	const [admin, setAdmin] = useState<AdminUser | null>(getStoredAdminUser())
	const [summary, setSummary] = useState<DashboardSummary | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState("")

	useEffect(() => {
		let isMounted = true

		async function loadDashboard() {
			try {
				const authenticatedAdmin = await fetchAuthenticatedAdmin()
				const dashboardSummary = await fetchDashboardSummary()

				if (!isMounted) return

				setAdmin(authenticatedAdmin)
				setSummary(dashboardSummary)
			} catch (loadError) {
				if (!isMounted) return
				clearAdminSession()
				setError(loadError instanceof Error ? loadError.message : "Failed to load dashboard")
				navigate("/admin/login", { replace: true })
			} finally {
				if (isMounted) setLoading(false)
			}
		}

		loadDashboard()

		return () => {
			isMounted = false
		}
	}, [navigate])

	const recentBlog = useMemo(() => summary?.blog.recent ?? [], [summary])
	const recentReviews = useMemo(() => summary?.reviews.recent ?? [], [summary])
	const recentContent = useMemo(() => summary?.content.recent ?? [], [summary])

	async function handleLogout() {
		await logoutAdmin()
		navigate("/admin/login", { replace: true })
	}

	if (loading) {
		return (
			<PageSectionLayout title="Dashboard" theme="slate">
				<div className="rounded-2xl border border-slate-200 bg-white/85 p-6 text-slate-600 shadow-sm">
					Loading dashboard...
				</div>
			</PageSectionLayout>
		)
	}

	if (error) {
		return (
			<PageSectionLayout title="Dashboard" theme="slate">
				<div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 shadow-sm">
					{error}
				</div>
			</PageSectionLayout>
		)
	}

	return (
		<PageSectionLayout title="Dashboard" theme="slate">
			<div className="space-y-8">
				<div className="rounded-2xl border border-[#c9dcf1] bg-gradient-to-r from-[#edf5ff] via-white to-[#fff4e8] p-6 shadow-[0_8px_24px_rgba(12,59,103,0.08)]">
					<div className="flex flex-wrap items-center justify-between gap-4">
						<div>
							<p className="text-sm font-semibold uppercase tracking-wide text-[#1f5c92]">Dashboard</p>
							<h2 className="mt-2 text-2xl font-bold text-[#0c3b67] md:text-3xl">
								Welcome back, {admin?.displayName ?? 'Admin'}
							</h2>
							<p className="mt-2 text-sm text-slate-600">Live overview powered by the backend.</p>
						</div>
						<Button type="button" variant="ghost" onClick={handleLogout} className="border border-slate-200 bg-white/80">
							Logout
						</Button>
					</div>
				</div>

				<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-slate-600">Blog Posts</p>
							<FileText className="h-4 w-4 text-[#1f5c92]" />
						</div>
						<p className="mt-3 text-3xl font-bold text-[#0c3b67]">{summary?.blog.total ?? 0}</p>
						<p className="mt-2 text-sm text-slate-600">{summary?.blog.published ?? 0} published, {summary?.blog.drafts ?? 0} drafts</p>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-slate-600">Reviews</p>
							<Star className="h-4 w-4 text-orange-500" />
						</div>
						<p className="mt-3 text-3xl font-bold text-[#0c3b67]">{summary?.reviews.total ?? 0}</p>
						<p className="mt-2 text-sm text-slate-600">{summary?.reviews.approved ?? 0} approved, {summary?.reviews.pending ?? 0} pending</p>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-slate-600">Content Items</p>
							<Settings className="h-4 w-4 text-[#1f5c92]" />
						</div>
						<p className="mt-3 text-3xl font-bold text-[#0c3b67]">{summary?.content.total ?? 0}</p>
						<p className="mt-2 text-sm text-slate-600">Managed from the admin dashboard</p>
					</div>

					<div className="rounded-2xl border border-slate-200 bg-white/85 p-5 shadow-sm">
						<div className="flex items-center justify-between">
							<p className="text-sm font-semibold text-slate-600">System Status</p>
							<MessageSquare className="h-4 w-4 text-[#1f5c92]" />
						</div>
						<p className="mt-3 text-3xl font-bold text-[#0c3b67]">Live</p>
						<p className="mt-2 text-sm text-slate-600">Connected to backend APIs</p>
					</div>
				</div>

				<div className="grid gap-6 xl:grid-cols-3">
					<TextCard className="bg-white/85 xl:col-span-2">
						<div className="flex items-center gap-2 text-[#0c3b67]">
							<BarChart3 className="h-5 w-5" />
							<h3 className="text-2xl font-bold">Recent Activity</h3>
						</div>

						<div className="mt-6 grid gap-4 md:grid-cols-3">
							<div>
								<p className="text-sm font-semibold text-slate-600">Recent Posts</p>
								<div className="mt-3 space-y-3">
									{recentBlog.map((item) => (
										<div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
											<p className="font-semibold text-[#0c3b67]">{item.title}</p>
											<p className="text-sm text-slate-600">{item.published ? 'Published' : 'Draft'}</p>
										</div>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-semibold text-slate-600">Recent Reviews</p>
								<div className="mt-3 space-y-3">
									{recentReviews.map((item) => (
										<div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
											<p className="font-semibold text-[#0c3b67]">{item.authorName}</p>
											<p className="text-sm text-slate-600">{item.approved ? 'Approved' : 'Pending'}</p>
										</div>
									))}
								</div>
							</div>
							<div>
								<p className="text-sm font-semibold text-slate-600">Content Items</p>
								<div className="mt-3 space-y-3">
									{recentContent.map((item) => (
										<div key={item.id} className="rounded-xl border border-slate-200 bg-white/80 p-3">
											<p className="font-semibold text-[#0c3b67]">{item.title}</p>
											<p className="text-sm text-slate-600">{item.key}</p>
										</div>
									))}
								</div>
							</div>
						</div>
					</TextCard>

					<TextCard className="bg-white/85">
						<div className="flex items-center gap-2 text-[#0c3b67]">
							<MessageSquare className="h-5 w-5" />
							<h3 className="text-2xl font-bold">Shortcuts</h3>
						</div>
						<div className="mt-6 space-y-3">
							<Button type="button" fullWidth onClick={() => navigate('/admin/dashboard')}>
								Open Admin Manager
							</Button>
							<Button type="button" fullWidth variant="ghost" onClick={() => navigate('/blog')}>
								View Blog
							</Button>
							<Button type="button" fullWidth variant="ghost" onClick={() => navigate('/reviews')}>
								View Reviews
							</Button>
						</div>
					</TextCard>
				</div>
			</div>
		</PageSectionLayout>
	)
}