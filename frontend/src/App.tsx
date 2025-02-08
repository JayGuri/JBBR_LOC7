import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import { UploadPage } from "./pages/UploadPage"
import { ReportsPage } from "./pages/ReportsPage"
import { AdminPage } from "./pages/AdminPage"

export default function App() {
  const customImageSrc = "/hero.jpg" // Your hero image path

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage customImageSrc={customImageSrc} />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/admin/*" element={<AdminPage />} />
      </Routes>
    </Router>
  )
}

