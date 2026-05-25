import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { LogIn } from "lucide-react"
import PageSectionLayout from "../components/layout/PageSectionLayout"
import Button from "../components/ui/Button"
import { loginAdmin, getStoredAdminToken, getStoredAdminUser, signUpUser } from "../services/authService"

const unifiedCardClassName =
	"rounded-2xl border border-[#d0deed] bg-gradient-to-br from-white to-[#eef5ff] shadow-[0_4px_16px_rgba(12,59,103,0.08)]"

export default function AdminLogin() {
	const navigate = useNavigate()
	const [mode, setMode] = useState<"login" | "signup">("login")
	const [displayName, setDisplayName] = useState("")
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")
	const [successMessage, setSuccessMessage] = useState("")
	const [loggedIn, setLoggedIn] = useState(false)

	useEffect(() => {
		if (getStoredAdminToken()) {
			const storedUser = getStoredAdminUser()
			navigate(storedUser?.role === "admin" ? "/admin/dashboard" : "/", { replace: true })
		}
	}, [navigate])

	const inputBase =
		"w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none " +
		"placeholder:text-slate-400 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		setIsSubmitting(true)
		setErrorMessage("")
		setSuccessMessage("")

		try {
			if (mode === "signup") {
				await signUpUser({
					displayName,
					email,
					password,
				})
				setSuccessMessage("Account created successfully. Redirecting to home.")
				navigate("/", { replace: true })
				return
			}

			await loginAdmin({ email, password })
			setLoggedIn(true)
			navigate("/admin/dashboard", { replace: true })
		} catch (error) {
			setErrorMessage(error instanceof Error ? error.message : mode === "signup" ? "Sign up failed" : "Login failed")
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<PageSectionLayout title={mode === "signup" ? "Sign Up" : "Login"} theme="slate">
			<div className={`mx-auto mt-8 w-full max-w-2xl ${unifiedCardClassName} p-6 md:p-8`}>
				{loggedIn ? (
					<div className="flex flex-col items-center justify-center gap-4 text-center">
						<div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
							<LogIn className="h-6 w-6 text-orange-500" strokeWidth={2} />
						</div>
						<h2 className="text-2xl font-bold text-[#0c3b67]">Logged in</h2>
						<p className="text-base text-slate-700">
							Redirecting you to the admin dashboard.
						</p>
						<Button
							type="button"
							onClick={() => navigate("/admin/dashboard")}
							className="px-5 py-2.5"
						>
							Go now
						</Button>
					</div>
				) : (
					<form onSubmit={handleSubmit} className="space-y-5">
						<div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
							<button
								type="button"
								onClick={() => {
									setMode("login")
									setErrorMessage("")
									setSuccessMessage("")
								}}
								className={[
									"rounded-lg px-4 py-2 text-sm font-semibold transition",
									mode === "login" ? "bg-white text-[#0c3b67] shadow-sm" : "text-slate-600 hover:text-[#0c3b67]",
								].join(" ")}
							>
								Login
							</button>
							<button
								type="button"
								onClick={() => {
									setMode("signup")
									setErrorMessage("")
									setSuccessMessage("")
								}}
								className={[
									"rounded-lg px-4 py-2 text-sm font-semibold transition",
									mode === "signup" ? "bg-white text-[#0c3b67] shadow-sm" : "text-slate-600 hover:text-[#0c3b67]",
								].join(" ")}
							>
								Sign Up
							</button>
						</div>
						<p className="text-base text-slate-700">
							{mode === "signup"
								? "Create a new account, then use Login to access your account."
								: "Use your credentials to sign in. Admin users can access the dashboard."}
						</p>
						<div className="grid gap-5">
							{mode === "signup" ? (
								<div className="flex flex-col gap-1.5">
									<label className="text-sm font-semibold text-slate-700">Display name</label>
									<input
										required
										type="text"
										value={displayName}
										onChange={(event) => setDisplayName(event.target.value)}
										placeholder="Your name"
										className={inputBase}
									/>
								</div>
							) : null}
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-semibold text-slate-700">Email</label>
								<input
									required
									type="email"
									value={email}
									onChange={(event) => setEmail(event.target.value)}
									placeholder="admin@solventa.com"
									className={inputBase}
								/>
							</div>
							<div className="flex flex-col gap-1.5">
								<label className="text-sm font-semibold text-slate-700">Password</label>
								<input
									required
									type="password"
									value={password}
									onChange={(event) => setPassword(event.target.value)}
									placeholder="Your admin password"
									className={inputBase}
								/>
							</div>
						</div>
						{successMessage ? (
							<p className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
								{successMessage}
							</p>
						) : null}
						{errorMessage ? (
							<p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
								{errorMessage}
							</p>
						) : null}
						<Button
							type="submit"
							disabled={isSubmitting}
							className="gap-2 px-6"
						>
							<LogIn className="h-4 w-4" strokeWidth={2} />
							{isSubmitting ? (mode === "signup" ? "Creating account..." : "Signing in...") : mode === "signup" ? "Create account" : "Continue"}
						</Button>
					</form>
				)}
			</div>
		</PageSectionLayout>
	)
}
