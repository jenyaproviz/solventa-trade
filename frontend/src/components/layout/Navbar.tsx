import { useEffect, useState } from "react"
import { MoonStar, SunMedium } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import Button from "../ui/Button"
import {
  AUTH_CHANGED_EVENT,
  clearAdminSession,
  getStoredAdminUser,
  type AdminUser,
} from "../../services/authService"

const THEME_STORAGE_KEY = "solventa_theme"

const navItems = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/blog", label: "Blog" },
  { to: "/reviews", label: "Reviews" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [theme, setTheme] = useState<"light" | "dark">("light")
  const [admin, setAdmin] = useState<AdminUser | null>(getStoredAdminUser())
  const navigate = useNavigate()

  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
    if (savedTheme === "dark" || savedTheme === "light") {
      setTheme(savedTheme)
      return
    }

    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }, [theme])

  useEffect(() => {
	const syncAuthState = () => {
		setAdmin(getStoredAdminUser())
	}

	window.addEventListener("storage", syncAuthState)
	window.addEventListener(AUTH_CHANGED_EVENT, syncAuthState)

	return () => {
		window.removeEventListener("storage", syncAuthState)
		window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthState)
	}
  }, [])

  function toggleTheme() {
    setTheme((prev) => (prev === "light" ? "dark" : "light"))
  }

  function handleLogout() {
	clearAdminSession()
	navigate("/admin/login", { replace: true })
  }

  return (
    <header className="sv-navbar sticky top-0 z-50 border-b border-[#d8e5f4] bg-white/80 shadow-[0_2px_14px_rgba(12,59,103,0.06)] backdrop-blur-md">
      <div className="mx-auto w-full max-w-[100rem] px-1 py-4 md:px-2 lg:px-3">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <NavLink to="/" className="inline-flex items-center gap-3" end>
            <span className="sv-brand-logo-wrap relative inline-block h-16 w-[240px] md:h-20 md:w-[300px]">
              <img
                src="/logo.jpg"
                alt="Solventa logo"
                className="sv-brand-logo-base absolute inset-0 h-full w-full object-contain"
              />
              <img
                src="/logo.jpg"
                alt=""
                aria-hidden="true"
                className="sv-brand-logo-text absolute inset-0 h-full w-full object-contain"
              />
            </span>
          </NavLink>
          <nav className="flex flex-wrap items-center gap-3 md:justify-end">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                      "rounded-md px-4 py-2 text-lg font-semibold transition-all duration-300 md:text-xl",
                    isActive
                        ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white shadow-[0_6px_16px_rgba(249,115,22,0.32)]"
                        : "text-[#27415f] hover:bg-[#edf4ff] hover:text-[#0c3b67]",
                  ].join(" ")
                }
                end={item.to === "/"}
              >
                {item.label}
              </NavLink>
            ))}
      {admin ? (
        <div className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white/70 px-3 py-1.5">
          {admin.role === 'admin' && (
            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) =>
                [
                  "rounded-md px-3 py-1 text-sm font-semibold transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-400 text-white"
                    : "text-[#27415f] hover:bg-[#edf4ff] hover:text-[#0c3b67]",
                ].join(" ")
              }
            >
              Admin Dashboard
            </NavLink>
          )}
          <span className="max-w-[180px] truncate text-sm font-semibold text-[#27415f]" title={admin.email}>
            {admin.displayName || admin.email}
          </span>
          <Button type="button" variant="ghost" onClick={handleLogout} className="h-8 rounded-md !px-3 !py-1 text-xs">
            Logout
          </Button>
        </div>
      ) : (
        <Button type="button" variant="ghost" onClick={() => navigate("/admin/login")} className="rounded-md !px-4 !py-2 text-base font-semibold md:text-lg">
          Login
        </Button>
      )}
            <Button
              type="button"
              onClick={toggleTheme}
              width={44}
              height={44}
              variant="ghost"
              className="theme-toggle rounded-md bg-transparent !px-0 !py-0 text-[#27415f] hover:text-[#0c3b67]"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Light mode" : "Dark mode"}
            >
              {theme === "dark" ? (
                <SunMedium className="h-5 w-5" />
              ) : (
                <MoonStar className="h-5 w-5" />
              )}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
}
