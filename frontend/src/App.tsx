import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"
import { UploadPage } from "./pages/UploadPage"

export default function App() {
  const customImageSrc = "/hero.jpg" // Your hero image path

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage customImageSrc={customImageSrc} />} />
        <Route path="/upload" element={<UploadPage />} />
      </Routes>
    </Router>
  )
}

