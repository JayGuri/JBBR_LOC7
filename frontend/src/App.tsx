import { BrowserRouter as Router } from "react-router-dom"
import { LandingPage } from "./pages/LandingPage"

export default function App() {
  const customImageSrc = "/hero.jpg" // Adjust this path as needed

  return (
    <Router>
      <LandingPage customImageSrc={customImageSrc} />
    </Router>
  )
}