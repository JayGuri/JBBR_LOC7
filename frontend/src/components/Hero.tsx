export function Hero() {
  return (
    <div className="flex min-h-[calc(100vh-88px)] relative">
      {/* Left Content */}
      <div className="flex-1 pl-12 pt-20">
        <h1 className="text-7xl font-normal leading-tight text-white max-w-[600px]">
          Discover
          <br />
          the power
          <br />
          of
        </h1>
        <p className="text-gray-300 mt-6 mb-8 text-lg">
          Empower your business with
          <br />
          seamless AI-driven fraud detection
        </p>
        <div className="flex gap-4">
          <button className="px-8 py-2 bg-[#ffdbdb] rounded-full text-[#161a34] hover:bg-[#ffdbdb]/90 transition-colors">
            Login
          </button>
          <button className="px-8 py-2 bg-[#ffdbdb] rounded-full text-[#161a34] hover:bg-[#ffdbdb]/90 transition-colors">
            Sign Up
          </button>
        </div>
      </div>

      {/* Right Content - Illustration */}
      <div className="flex-1 relative">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Gac3zWoiXesAqk9a9iikJaRC2Tp5p1.png"
          alt="Isometric illustration of laptop and UI elements"
          className="absolute right-0 top-1/2 -translate-y-1/2 max-w-[800px]"
        />
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-20 left-0 right-0 text-center">
        <h2 className="text-4xl font-normal text-white mb-2">Uncover the Truth</h2>
        <p className="text-gray-400 text-sm">dive deep into the world of fraud detection</p>
      </div>

      {/* Decorative Circle */}
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500 to-yellow-400 rounded-full -translate-y-1/2 -translate-x-1/2 opacity-80" />
    </div>
  )
}

