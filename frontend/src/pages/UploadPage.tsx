"use client"

import { useState } from "react"
import { Navbar } from "../components/Navbar"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { UploadModal } from "../components/UploadModal"

export function UploadPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#ffffff] relative overflow-hidden flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Top-left Receipt */}
        <img
          src="./Left.png"
          alt=""
          className="absolute top-[10%] left-[5%] w-[15%] max-w-[100px] opacity-70 transform -rotate-12 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-md"
          aria-hidden="true"
        />

        {/* Bottom-left Receipt */}
        <img
          src="./Bottom.png"
          alt=""
          className="absolute bottom-[15%] left-[10%] w-[25%] max-w-[200px] opacity-80 transform rotate-6 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-lg"
          aria-hidden="true"
        />

        {/* Bottom-right Receipt */}
        <img
          src="./Expanded.png"
          alt=""
          className="absolute bottom-[20%] right-[5%] w-[20%] max-w-[150px] opacity-70 transform rotate-12 hover:rotate-0 transition-all duration-300 ease-in-out filter drop-shadow-md"
          aria-hidden="true"
        />

        {/* Main Content */}
        <div className="max-w-3xl w-full text-center space-y-6 relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal leading-tight text-[#000000]">
            Upload your receipts
          </h1>
          <p className="text-gray-600 text-base md:text-lg max-w-xl mx-auto">
            Load your receipt by selecting a file—our system will instantly process and analyse it for accuracy and
            fraud detection. You will be provided with a report soon.
          </p>
          <div className="mt-8">
            <Button
              className="bg-[#161a34] hover:bg-[#161a34]/90 text-[#ffffff] px-6 py-4 md:px-8 md:py-6 text-base md:text-lg rounded-full"
              onClick={() => setIsModalOpen(true)}
            >
              <Upload className="mr-2 h-5 w-5" />
              Select your receipts
            </Button>
          </div>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}

