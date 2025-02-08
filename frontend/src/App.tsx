import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import { UploadPage } from "./pages/UploadPage"
import { ReportsPage } from "./pages/ReportsPage"
import { AdminPage } from "./pages/AdminPage"
import { LoginPage } from "./pages/LoginPage"
import { AppDataProvider } from "../src/contexts/AppDataContent"
import { SignupPage } from "./pages/SignupPage"

export default function App() {
  const customImageSrc = "/hero.jpg" // Your hero image path

  return (
    <AppDataProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage customImageSrc={customImageSrc} />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/admin/*" element={<AdminPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </Router>
    </AppDataProvider>
  )
}

