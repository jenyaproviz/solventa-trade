import type { ReactNode } from "react"
import Navbar from "./Navbar"
import Footer from "./Footer"

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell relative min-h-screen flex flex-col text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="app-blob app-blob-1 absolute -left-24 top-10 h-72 w-72 rounded-full bg-[#0c3b67]/10 blur-3xl" />
        <div className="app-blob app-blob-2 absolute -right-16 top-0 h-64 w-64 rounded-full bg-orange-400/15 blur-3xl" />
        <div className="app-blob app-blob-3 absolute bottom-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-sky-300/10 blur-3xl" />
      </div>
      <Navbar />
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-1 py-10 md:px-2 md:py-12 lg:px-3">
        {children}
      </main>
      <Footer />
    </div>
  )
}
