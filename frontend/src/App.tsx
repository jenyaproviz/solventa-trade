import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
import About from "./pages/About"
import AdminDashboard from "./pages/AdminDashboard"
import AdminLogin from "./pages/AdminLogin"
import Blog from "./pages/Blog"
import BlogPostPage from "./pages/BlogPost"
import Dashboard from "./pages/Dashboard"
import Contact from "./pages/Contact"
import Home from "./pages/Home"
import Reviews from "./pages/Reviews"
import Services from "./pages/Services"
import Cement from "./pages/Cement"
import Concrete from "./pages/Concrete"
import Quarry from "./pages/Quarry"
import Lime from "./pages/Lime"

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/cement" element={<Cement />} />
          <Route path="/services/concrete" element={<Concrete />} />
          <Route path="/services/quarry" element={<Quarry />} />
          <Route path="/services/lime" element={<Lime />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
