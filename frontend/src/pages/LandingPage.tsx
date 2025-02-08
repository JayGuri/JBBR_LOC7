import { Navbar } from "../components/Navbar"

interface LandingPageProps {
  customImageSrc: string
}

export function LandingPage({ customImageSrc }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden flex flex-col">
      <Navbar />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-between px-12">
        {/* Left Side - Text Content */}
        <div className="max-w-xl">
          <h1 className="text-[80px] font-normal leading-tight text-black">
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
            <button className="px-8 py-3 bg-[#ffdbdb] rounded-full text-black font-medium text-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#ffc9c9] hover:shadow-lg hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffdbdb] focus:ring-opacity-50">
              Login
            </button>
            <button className="px-8 py-3 bg-[#ffdbdb] rounded-full text-black font-medium text-lg shadow-md transition-all duration-300 ease-in-out hover:bg-[#ffc9c9] hover:shadow-lg hover:transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#ffdbdb] focus:ring-opacity-50">
              Sign Up
            </button>
          </div>
        </div>

        {/* Right Side - Custom Image */}
        <div className="relative">
          <img src={customImageSrc || "../hero.jpg"} alt="Custom illustration" className="w-[700px] object-contain" />
        </div>
      </div>

      {/* Bottom Content */}
      <div className="text-center mb-20">
        <h2 className="text-5xl font-normal text-black mb-3">Uncover the Truth</h2>
        <p className="text-gray-500 text-lg">dive deep into the world of fraud detection</p>
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

