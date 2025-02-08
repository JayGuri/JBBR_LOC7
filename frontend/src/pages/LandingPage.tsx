import { Navbar } from "../components/Navbar"
import { useAppData } from "../contexts/AppDataContent"
import { useNavigate } from "react-router-dom"

interface LandingPageProps {
  customImageSrc: string
}

export function LandingPage({ customImageSrc }: LandingPageProps) {
  const { currentUser } = useAppData()
  const navigate = useNavigate()

  return (
    <div className="h-screen bg-[#ffffff] relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <div className="flex-1 flex items-start justify-between">
          {/* Left Side - Text Content */}
          <div className="max-w-xl pl-12 mt-20">
            <h1 className="text-[80px] font-normal leading-tight text-[#000000]">
              Discover
              <br />
              the power
              <br />
              of
            </h1>
            <p className="text-gray-600 mt-6 mb-8 text-lg">
              Empower your business with
              <br />
              seamless AI-driven fraud detection
            </p>
            <div className="flex gap-4">
              {currentUser ? (
                <button
                  className="px-8 py-3 bg-[#ffdbdb] rounded-full text-[#000000] font-medium text-lg transition-all duration-300 ease-in-out hover:bg-[#ffc9c9] hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffdbdb] focus:ring-opacity-50"
                  onClick={() => navigate("/upload")}
                >
                  Upload Receipt
                </button>
              ) : (
                <>
                  <button className="px-8 py-3 bg-[#ffdbdb] rounded-full text-[#000000] font-medium text-lg transition-all duration-300 ease-in-out hover:bg-[#ffc9c9] hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffdbdb] focus:ring-opacity-50">
                    Login
                  </button>
                  <button className="px-8 py-3 bg-[#ffdbdb] rounded-full text-[#000000] font-medium text-lg transition-all duration-300 ease-in-out hover:bg-[#ffc9c9] hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffdbdb] focus:ring-opacity-50">
                    Sign Up
                  </button>
                </>
              )}
            </div>
          </div>
          {/* Right Side - Custom Image */}
          <div className="relative h-full flex-1">
            <img
              src={customImageSrc || "/placeholder.svg?height=600&width=800"}
              alt="Custom illustration"
              className="absolute top-0 right-0 h-full w-auto object-cover object-right"
            />
          </div>
        </div>

        {/* Bottom Content */}
        <div className="text-center mb-8 px-12">
          <h2 className="text-5xl font-normal text-[#000000] mb-3">Uncover the Truth</h2>
          <p className="text-gray-500 text-lg">dive deep into the world of fraud detection</p>
        </div>
      </div>

      {/* Decorative Circle */}
      <div
        className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full"
        style={{
          background: "linear-gradient(135deg, #FF8A4C 0%, #FF6B24 100%)",
          opacity: 0.8,
        }}
      />
    </div>
  )
}

