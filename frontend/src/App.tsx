import { BrowserRouter as Router } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Hero } from "./components/Hero"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#161a34] overflow-hidden">
        <Navbar />
        <Hero />
      </div>
    </Router>
  )
}

